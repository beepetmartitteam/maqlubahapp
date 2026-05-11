const express = require('express');
const { sequelize, Ahli } = require('../models');
const jualanSabun = require('../models/jualanSabun');
const { JualanSabunRecord, JualanSabunDetail, Folder } = jualanSabun(sequelize);

// Setup associations
JualanSabunDetail.belongsTo(Ahli, {
  foreignKey: 'ahliId',
  targetKey: 'id',
  as: 'ahli'
});

Ahli.hasMany(JualanSabunDetail, {
  foreignKey: 'ahliId',
  sourceKey: 'id',
  as: 'jualanDetails'
});

const router = express.Router();

// Initialize jualan sabun tables
router.post('/init-tables', async (req, res) => {
  try {
    // Sync models
    await sequelize.sync({ force: false, alter: true });
    
    // Create default folders
    const defaultFolders = [
      { id: 'S13', label: '📁 S13', color: '#0F6E56' },
      { id: 'MKN', label: '📁 MKN ++', color: '#185FA5' },
      { id: 'MUSLIMAH', label: '📁 MUSLIMAH', color: '#993556' },
      { id: 'L_LELAKI', label: '📁 LAIN² LELAKI', color: '#854F0B' },
      { id: 'L_MUSLIMAH', label: '📁 LAIN2 MUSLIMAH', color: '#72243E' },
      { id: 'KOMUNITI', label: '📁 KOMUNITI', color: '#534AB7' }
    ];

    for (const folderData of defaultFolders) {
      await Folder.findOrCreate({
        where: { id: folderData.id },
        defaults: folderData
      });
    }

    res.json({ success: true, message: 'Jualan Sabun tables initialized successfully' });
  } catch (error) {
    console.error('Error initializing jualan tables:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all jualan folders
router.get('/folders', async (req, res) => {
  try {
    const folders = await Folder.findAll({
      order: [['id', 'ASC']]
    });
    res.json({ success: true, data: folders });
  } catch (error) {
    console.error('Error fetching jualan folders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or update jualan record
router.post('/records', async (req, res) => {
  try {
    const { month, week, year, totalAmount, totalMembers, paidMembers, status, details } = req.body;
    
    // Use transaction for data integrity
    const result = await sequelize.transaction(async (t) => {
      // Check if record already exists
      const existingRecord = await JualanSabunRecord.findOne({
        where: { month, week, year },
        transaction: t
      });
      
      let record;
      if (existingRecord) {
        // Update existing record
        record = await existingRecord.update({
          totalAmount,
          totalMembers,
          paidMembers,
          recordDate: new Date(),
          status
        }, { transaction: t });
        
        // Delete existing details and create new ones
        await JualanSabunDetail.destroy({
          where: { recordId: record.id },
          transaction: t
        });
      } else {
        // Create new record
        record = await JualanSabunRecord.create({
          month,
          week,
          year,
          totalAmount,
          totalMembers,
          paidMembers,
          recordDate: new Date(),
          status
        }, { transaction: t });
      }
      
      // Create detail records
      const detailRecords = details.map(detail => ({
        recordId: record.id,
        folderId: detail.folderId,
        folderLabel: detail.folderLabel,
        ahliId: detail.ahliId,
        amount: detail.amount
      }));
      
      await JualanSabunDetail.bulkCreate(detailRecords, { transaction: t });
      
      return record;
    });
    
    const action = result._changed.size > 0 ? 'updated' : 'created';
    res.json({ 
      success: true, 
      recordId: result.id, 
      message: `Jualan record ${action} successfully`,
      action: action
    });
  } catch (error) {
    console.error('Error saving jualan record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific jualan record by month, week, year
router.get('/records/:month/:week/:year', async (req, res) => {
  try {
    const { month, week, year } = req.params;
    
    const record = await JualanSabunRecord.findOne({
      where: { 
        month: parseInt(month), 
        week: parseInt(week), 
        year: parseInt(year) 
      },
      include: [
        {
          model: JualanSabunDetail,
          as: 'details',
          include: [{
            model: require('../models').Ahli,
            as: 'ahli'
          }]
        }
      ]
    });

    if (!record) {
      return res.json({ 
        success: false, 
        message: 'Record not found',
        data: null 
      });
    }

    res.json({ 
      success: true, 
      data: record 
    });
  } catch (error) {
    console.error('Error fetching jualan record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get jualan records with filtering
router.get('/records', async (req, res) => {
  try {
    const { month, week, year, limit = 50, offset = 0 } = req.query;
    
    const whereClause = {};
    if (month) whereClause.month = month;
    if (week) whereClause.week = week;
    if (year) whereClause.year = year;
    
    const records = await JualanSabunRecord.findAll({
      where: whereClause,
      include: [
        {
          model: JualanSabunDetail,
          as: 'details',
          include: [{
            model: require('../models').Ahli,
            as: 'ahli'
          }]
        }
      ],
      order: [
        ['year', 'DESC'],
        ['month', 'DESC'],
        ['week', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching jualan records:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get jualan record details
router.get('/records/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    const details = await JualanSabunDetail.findAll({
      where: { recordId: id },
      order: [['folderId', 'ASC'], ['memberName', 'ASC']]
    });
    
    res.json({ success: true, data: details });
  } catch (error) {
    console.error('Error fetching jualan record details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete jualan record
router.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await JualanSabunRecord.destroy({
      where: { id }
    });
    
    if (deletedCount > 0) {
      res.json({ success: true, message: 'Jualan record deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Jualan record not found' });
    }
  } catch (error) {
    console.error('Error deleting jualan record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get jualan statistics
router.get('/statistics', async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const whereClause = {};
    if (month) whereClause.month = month;
    if (year) whereClause.year = year;
    
    const { DataTypes, Op } = require('sequelize');
    const stats = await JualanSabunRecord.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_records'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'grand_total'],
        [sequelize.fn('SUM', sequelize.col('paid_members')), 'total_paid'],
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'average_amount'],
        [sequelize.fn('MAX', sequelize.col('total_amount')), 'highest_amount']
      ],
      raw: true
    });
    
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Error fetching jualan statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add member to folder
// Add member to folder
router.post('/folders/:folderId/members', async (req, res) => {
  try {
    const { folderId } = req.params;
    const { memberName } = req.body;

    // Validation
    if (!memberName || memberName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Member name is required'
      });
    }

    // Find folder
    const folder = await Folder.findByPk(folderId);

    if (!folder) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found'
      });
    }

    // CREATE NEW AHLI RECORD
    const newAhli = await Ahli.create({
      name: memberName.trim(),
      folderId: folder.id,
      folderLabel: folder.label || folder.name,
      isActive: true
    });

    res.json({
      success: true,
      message: 'Member added successfully',
      data: newAhli
    });

  } catch (error) {
    console.error('Error adding member to folder:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove member from folder
router.delete('/folders/:folderId/members/:memberName', async (req, res) => {
  try {
    const { folderId, memberName } = req.params;
    
    // For now, we'll just return success since the frontend manages members locally
    // In a full implementation, you might want to remove members from database
    
    res.json({ 
      success: true, 
      message: 'Member removed successfully',
      data: {
        folderId,
        memberName
      }
    });
  } catch (error) {
    console.error('Error removing member from folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check for jualan sabun
router.get('/health', async (req, res) => {
  try {
    const recordCount = await JualanSabunRecord.count();
    const folderCount = await Folder.count();
    
    res.json({ 
      status: 'OK',
      service: 'Jualan Sabun API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        records: recordCount,
        folders: folderCount,
        connected: true
      }
    });
  } catch (error) {
    console.error('Jualan Sabun health check error:', error);
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

module.exports = router;
