const express = require('express');
const { sequelize, Ahli } = require('../models');
const jualanSabun = require('../models/jualanSabun');
const { Folder } = jualanSabun(sequelize);

// Setup associations
Folder.hasMany(Ahli, {
  foreignKey: 'folderId',
  sourceKey: 'id',
  as: 'ahlis'
});

Ahli.belongsTo(Folder, {
  foreignKey: 'folderId',
  targetKey: 'id',
  as: 'folder'
});

const router = express.Router();

// Get all ahli grouped by folder
router.get('/', async (req, res) => {
  try {
    const folders = await Folder.findAll({
      include: [{
        model: Ahli,
        as: 'ahlis',
        where: { isActive: true },
        required: false
      }],
      order: [
        ['id', 'DESC'],
        [{ model: Ahli, as: 'ahlis' }, 'id', 'ASC']
      ]
    });

    // Format response
    const formattedData = folders.map(folder => ({
      id: folder.id,
      label: folder.label,
      color: folder.color,
      members: folder.ahlis.map(ahli => ({
        id: ahli.id,
        name: ahli.name
      })),
      amounts: Array(folder.ahlis.length).fill(0)
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching ahli:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get ahli by folder
router.get('/folder/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    
    const ahlis = await Ahli.findAll({
      where: { 
        folderId,
        isActive: true 
      },
      include: [{
        model: Folder,
        as: 'folder'
      }],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: ahlis
    });
  } catch (error) {
    console.error('Error fetching ahli by folder:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new ahli
router.post('/', async (req, res) => {
  try {
    const { name, folderId, folderLabel } = req.body;

    if (!name || !folderId || !folderLabel) {
      return res.status(400).json({
        success: false,
        error: 'Name, folderId, and folderLabel are required'
      });
    }

    const ahli = await Ahli.create({
      name,
      folderId,
      folderLabel
    });

    res.status(201).json({
      success: true,
      message: 'Ahli created successfully',
      data: ahli
    });
  } catch (error) {
    console.error('Error creating ahli:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update ahli
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, folderId, folderLabel, isActive } = req.body;

    const [updatedCount] = await Ahli.update(
      { name, folderId, folderLabel, isActive },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ahli not found'
      });
    }

    res.json({
      success: true,
      message: 'Ahli updated successfully'
    });
  } catch (error) {
    console.error('Error updating ahli:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete ahli (soft delete - set isActive to false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [updatedCount] = await Ahli.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ahli not found'
      });
    }

    res.json({
      success: true,
      message: 'Ahli deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ahli:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Initialize ahli data from INITIAL_FOLDERS
router.post('/initialize', async (req, res) => {
  try {
    // Clear existing ahli data
    await Ahli.destroy({ where: {}, force: true });

    // Initial ahli data
    const initialAhlis = [
      // S13
      { name: "TC", folderId: "S13", folderLabel: "📁 S13" },
      { name: "TFY", folderId: "S13", folderLabel: "📁 S13" },
      { name: "TAA", folderId: "S13", folderLabel: "📁 S13" },
      { name: "THAH", folderId: "S13", folderLabel: "📁 S13" },
      { name: "MSMN", folderId: "S13", folderLabel: "📁 S13" },
      { name: "AL", folderId: "S13", folderLabel: "📁 S13" },
      { name: "E ZAHID", folderId: "S13", folderLabel: "📁 S13" },
      { name: "E SAYUTI", folderId: "S13", folderLabel: "📁 S13" },
      { name: "E ABU", folderId: "S13", folderLabel: "📁 S13" },
      { name: "E FAJRUL", folderId: "S13", folderLabel: "📁 S13" },
      { name: "P AZURA", folderId: "S13", folderLabel: "📁 S13" },
      
      // MKN
      { name: "T ABIL", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "T FATEH", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "TN SYARIF", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "TN WAJI", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "E KHUSAIRI", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "T NHAZANI", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "TN ANUAR", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "TN HAMDI", folderId: "MKN", folderLabel: "📁 MKN ++" },
      { name: "TN FIDA", folderId: "MKN", folderLabel: "📁 MKN ++" },
      
      // MUSLIMAH
      { name: "PN KAKAK", folderId: "MUSLIMAH", folderLabel: "📁 MUSLIMAH" },
      { name: "P KHAULAH", folderId: "MUSLIMAH", folderLabel: "📁 MUSLIMAH" },
      { name: "PN QAYAH", folderId: "MUSLIMAH", folderLabel: "📁 MUSLIMAH" },
      { name: "C YAH", folderId: "MUSLIMAH", folderLabel: "📁 MUSLIMAH" },
      
      // L_LELAKI
      { name: "T ABBAD", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "PAK NANANG", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN NIK H", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN ABE THAI", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "TN MAAROF", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN P WAHAB", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN IKRIMAH", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "AM KAMIL", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "T AMIN", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "HJ KUDUS", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN YUSNIZA", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN ALI HASAN", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN AROBI", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN KHALID", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "EN JAFAR", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      { name: "TN RIDWAN", folderId: "L_LELAKI", folderLabel: "📁 LAIN² LELAKI" },
      
      // L_MUSLIMAH
      { name: "C AZIE", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C K NGAH", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C SAKINAH", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C ASILAH", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C Ita", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C YATI", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C (OM)", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C HAFIZAH", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C SAL", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "C FAH", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      { name: "I GINA", folderId: "L_MUSLIMAH", folderLabel: "📁 LAIN2 MUSLIMAH" },
      
      // KOMUNITI
      { name: "APS", folderId: "KOMUNITI", folderLabel: "📁 KOMUNITI" },
      { name: "AMCA", folderId: "KOMUNITI", folderLabel: "📁 KOMUNITI" },
      { name: "DUNGUN", folderId: "KOMUNITI", folderLabel: "📁 KOMUNITI" },
      { name: "LB", folderId: "KOMUNITI", folderLabel: "📁 KOMUNITI" },
      { name: "PERAK", folderId: "KOMUNITI", folderLabel: "📁 KOMUNITI" }
    ];

    await Ahli.bulkCreate(initialAhlis);

    res.json({
      success: true,
      message: 'Ahli data initialized successfully',
      count: initialAhlis.length
    });
  } catch (error) {
    console.error('Error initializing ahli data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
