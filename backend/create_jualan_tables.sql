-- ==================== JUALAN SABUN DATABASE SCHEMA ====================
-- Database: maqlubah_db

-- ==================== TABLE 1: FOLDERS ====================
-- Folder structure for organizing members
CREATE TABLE IF NOT EXISTS folders (
  id VARCHAR(20) PRIMARY KEY COMMENT 'Folder ID (S13, MKN, etc.)',
  label VARCHAR(100) NOT NULL COMMENT 'Folder display name with emoji',
  color VARCHAR(7) NOT NULL COMMENT 'Folder color code',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Folder definitions for jualan sabun';

-- ==================== TABLE 2: JUALAN_SABUN_RECORDS ====================
-- Main records for each week/month
CREATE TABLE IF NOT EXISTS jualan_sabun_records (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Record ID',
  month INT NOT NULL COMMENT 'Month (1-12)',
  week INT NOT NULL COMMENT 'Week (1-4)',
  year INT NOT NULL COMMENT 'Year (e.g., 2026)',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total sales amount',
  total_members INT NOT NULL DEFAULT 0 COMMENT 'Total number of members',
  paid_members INT NOT NULL DEFAULT 0 COMMENT 'Number of paid members',
  record_date DATE NOT NULL COMMENT 'Record date',
  status ENUM('active', 'completed') DEFAULT 'active' COMMENT 'Record status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  
  INDEX idx_month_week_year (month, week, year) COMMENT 'Composite index for filtering',
  INDEX idx_status (status) COMMENT 'Status index',
  INDEX idx_record_date (record_date) COMMENT 'Date index for sorting',
  INDEX idx_year_month (year, month) COMMENT 'Year-month index for reporting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Main jualan sabun records';

-- ==================== TABLE 3: JUALAN_SABUN_DETAILS ====================
-- Detailed member payments for each record
CREATE TABLE IF NOT EXISTS jualan_sabun_details (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Detail ID',
  record_id INT NOT NULL COMMENT 'Reference to main record',
  folder_id VARCHAR(20) NOT NULL COMMENT 'Folder reference',
  folder_label VARCHAR(100) NOT NULL COMMENT 'Folder name at time of record',
  member_name VARCHAR(100) NOT NULL COMMENT 'Member name',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Payment amount',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  
  FOREIGN KEY (record_id) REFERENCES jualan_sabun_records(id) ON DELETE CASCADE COMMENT 'Link to main record',
  INDEX idx_record_id (record_id) COMMENT 'Record reference index',
  INDEX idx_folder_id (folder_id) COMMENT 'Folder reference index',
  INDEX idx_member_name (member_name) COMMENT 'Member name search index'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Detailed payment records per member';

-- ==================== INSERT DEFAULT FOLDERS ====================
-- Initialize folder structure
INSERT IGNORE INTO folders (id, label, color) VALUES
('S13', '📁 S13', '#0F6E56'),
('MKN', '📁 MKN ++', '#185FA5'),
('MUSLIMAH', '📁 MUSLIMAH', '#993556'),
('L_LELAKI', '📁 LAIN² LELAKI', '#854F0B'),
('L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', '#72243E'),
('KOMUNITI', '📁 KOMUNITI', '#534AB7');

-- ==================== SAMPLE DATA ====================
-- Sample records for testing
INSERT INTO jualan_sabun_records (month, week, year, total_amount, total_members, paid_members, record_date, status) VALUES
(5, 1, 2026, 1250.00, 45, 12, '2026-05-01', 'active'),
(5, 2, 2026, 2100.00, 45, 18, '2026-05-08', 'active'),
(5, 3, 2026, 1850.00, 45, 15, '2026-05-15', 'active'),
(4, 4, 2026, 3200.00, 45, 22, '2026-04-22', 'completed'),
(4, 3, 2026, 2800.00, 45, 19, '2026-04-15', 'completed'),
(3, 2, 2026, 1500.00, 45, 10, '2026-03-08', 'completed');

-- Sample detail records (for first record above)
INSERT INTO jualan_sabun_details (record_id, folder_id, folder_label, member_name, amount) VALUES
(1, 'S13', '📁 S13', 'TC', 100.00),
(1, 'S13', '📁 S13', 'TFY', 0.00),
(1, 'S13', '📁 S13', 'TAA', 0.00),
(1, 'S13', '📁 S13', 'THAH', 0.00),
(1, 'S13', '📁 S13', 'MSMN', 0.00),
(1, 'S13', '📁 S13', 'AL', 0.00),
(1, 'S13', '📁 S13', 'E ZAHID', 0.00),
(1, 'S13', '📁 S13', 'E SAYUTI', 0.00),
(1, 'S13', '📁 S13', 'E ABU', 0.00),
(1, 'S13', '📁 S13', 'E FAJRUL', 0.00),
(1, 'S13', '📁 S13', 'P AZURA', 0.00);

-- ==================== VIEWS FOR REPORTING ====================
-- View for monthly summary
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
    r.year,
    r.month,
    MONTHNAME(r.record_date) as month_name,
    COUNT(*) as total_records,
    SUM(r.total_amount) as total_sales,
    SUM(r.paid_members) as total_paid_members,
    AVG(r.total_amount) as average_sales,
    MAX(r.total_amount) as highest_sales
FROM jualan_sabun_records r
GROUP BY r.year, r.month
ORDER BY r.year DESC, r.month DESC;

-- View for weekly summary
CREATE OR REPLACE VIEW weekly_summary AS
SELECT 
    r.year,
    r.month,
    r.week,
    r.record_date,
    r.status,
    COUNT(*) as total_records,
    SUM(r.total_amount) as total_sales,
    SUM(r.paid_members) as total_paid_members
FROM jualan_sabun_records r
GROUP BY r.year, r.month, r.week, r.record_date, r.status
ORDER BY r.record_date DESC;

-- ==================== INDEXES FOR PERFORMANCE ====================
-- Additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_records_year ON jualan_sabun_records(year);
CREATE INDEX IF NOT EXISTS idx_records_month ON jualan_sabun_records(month);
CREATE INDEX IF NOT EXISTS idx_records_year_month ON jualan_sabun_records(year, month);
CREATE INDEX IF NOT EXISTS idx_records_status_date ON jualan_sabun_records(status, record_date);
CREATE INDEX IF NOT EXISTS idx_details_record_folder ON jualan_sabun_details(record_id, folder_id);

-- ==================== USAGE EXAMPLES ====================
/*
-- Get all records for May 2026
SELECT r.*, COUNT(d.id) as detail_count
FROM jualan_sabun_records r
LEFT JOIN jualan_sabun_details d ON r.id = d.record_id
WHERE r.month = 5 AND r.year = 2026
GROUP BY r.id
ORDER BY r.record_date DESC;

-- Get weekly summary for current month
SELECT week, COUNT(*) as records, SUM(total_amount) as total
FROM jualan_sabun_records
WHERE month = 5 AND year = 2026
GROUP BY week
ORDER BY week;

-- Get member payment details for specific record
SELECT folder_label, member_name, amount
FROM jualan_sabun_details
WHERE record_id = 1
ORDER BY folder_id, member_name;

-- Get monthly performance report
SELECT 
    month_name,
    total_records,
    total_sales,
    total_paid_members,
    average_sales
FROM monthly_summary
WHERE year = 2026
ORDER BY month;
*/
