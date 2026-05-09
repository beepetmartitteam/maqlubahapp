const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'maqlubah_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Test database connection
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error);
  });

// ==================== TABLE STRUCTURE ====================

// Table: jualan_sabun_records
const CREATE_RECORDS_TABLE = `
CREATE TABLE IF NOT EXISTS jualan_sabun_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month INT NOT NULL,
  week INT NOT NULL,
  year INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_members INT NOT NULL DEFAULT 0,
  paid_members INT NOT NULL DEFAULT 0,
  record_date DATE NOT NULL,
  status ENUM('active', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_month_week_year (month, week, year),
  INDEX idx_status (status),
  INDEX idx_record_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Table: jualan_sabun_details
const CREATE_DETAILS_TABLE = `
CREATE TABLE IF NOT EXISTS jualan_sabun_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id INT NOT NULL,
  folder_id VARCHAR(20) NOT NULL,
  folder_label VARCHAR(100) NOT NULL,
  member_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES jualan_sabun_records(id) ON DELETE CASCADE,
  INDEX idx_record_id (record_id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_member_name (member_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Table: folders (for managing folder structure)
const CREATE_FOLDERS_TABLE = `
CREATE TABLE IF NOT EXISTS folders (
  id VARCHAR(20) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// ==================== API ROUTES ====================

// Initialize tables
app.post('/api/init-tables', async (req, res) => {
  try {
    await db.query(CREATE_RECORDS_TABLE);
    await db.query(CREATE_DETAILS_TABLE);
    await db.query(CREATE_FOLDERS_TABLE);
    
    // Insert default folders
    const defaultFolders = [
      ['S13', '📁 S13', '#0F6E56'],
      ['MKN', '📁 MKN ++', '#185FA5'],
      ['MUSLIMAH', '📁 MUSLIMAH', '#993556'],
      ['L_LELAKI', '📁 LAIN² LELAKI', '#854F0B'],
      ['L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', '#72243E'],
      ['KOMUNITI', '📁 KOMUNITI', '#534AB7']
    ];

    for (const [id, label, color] of defaultFolders) {
      await db.query(
        'INSERT IGNORE INTO folders (id, label, color) VALUES (?, ?, ?)',
        [id, label, color]
      );
    }

    res.json({ success: true, message: 'Tables initialized successfully' });
  } catch (error) {
    console.error('Error initializing tables:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all folders
app.get('/api/folders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM folders ORDER BY id');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save jualan record
app.post('/api/records', async (req, res) => {
  try {
    const { month, week, year, totalAmount, totalMembers, paidMembers, status, details } = req.body;
    
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert main record
      const [recordResult] = await connection.query(
        'INSERT INTO jualan_sabun_records (month, week, year, total_amount, total_members, paid_members, record_date, status) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)',
        [month, week, year, totalAmount, totalMembers, paidMembers, status]
      );
      
      const recordId = recordResult.insertId;
      
      // Insert details
      for (const detail of details) {
        await connection.query(
          'INSERT INTO jualan_sabun_details (record_id, folder_id, folder_label, member_name, amount) VALUES (?, ?, ?, ?, ?)',
          [recordId, detail.folderId, detail.folderLabel, detail.memberName, detail.amount]
        );
      }
      
      await connection.commit();
      res.json({ success: true, recordId, message: 'Record saved successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get records with filtering
app.get('/api/records', async (req, res) => {
  try {
    const { month, week, year, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT r.*, 
             COUNT(d.id) as detail_count
      FROM jualan_sabun_records r
      LEFT JOIN jualan_sabun_details d ON r.id = d.record_id
      WHERE 1=1
    `;
    const params = [];
    
    if (month) {
      query += ' AND r.month = ?';
      params.push(month);
    }
    
    if (week) {
      query += ' AND r.week = ?';
      params.push(week);
    }
    
    if (year) {
      query += ' AND r.year = ?';
      params.push(year);
    }
    
    query += ' GROUP BY r.id ORDER BY r.record_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get record details
app.get('/api/records/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM jualan_sabun_details WHERE record_id = ? ORDER BY folder_id, member_name',
      [id]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching record details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete record
app.delete('/api/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM jualan_sabun_records WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (month) {
      whereClause += ' AND month = ?';
      params.push(month);
    }
    
    if (year) {
      whereClause += ' AND year = ?';
      params.push(year);
    }
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_records,
        SUM(total_amount) as grand_total,
        SUM(paid_members) as total_paid,
        AVG(total_amount) as average_amount,
        MAX(total_amount) as highest_amount
      FROM jualan_sabun_records 
      ${whereClause}
    `, params);
    
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Jualan Sabun Server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('  POST /api/init-tables - Initialize database tables');
  console.log('  GET  /api/folders - Get all folders');
  console.log('  POST /api/records - Save new record');
  console.log('  GET  /api/records - Get records with filtering');
  console.log('  GET  /api/records/:id/details - Get record details');
  console.log('  DELETE /api/records/:id - Delete record');
  console.log('  GET  /api/statistics - Get statistics');
});

module.exports = app;
