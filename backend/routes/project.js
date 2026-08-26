const express = require('express');
const { Project, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
//router.use(authenticateToken);

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { type, status, city, negri, syarikat, search } = req.query;
    
    const whereClause = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (city) {
      whereClause.city = city;
    }
    
    if (negri) {
      whereClause.negri = negri;
    }
    
    if (syarikat) {
      whereClause.syarikat = syarikat;
    }
    
    if (search) {
      whereClause.name = {
        [require('sequelize').Op.like]: `%${search}%`
      };
    }
    
    const projects = await Project.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({
      where: { id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { 
      id, 
      name, 
      type, 
      status, 
      address, 
      city, 
      negri, 
      negara, 
      syarikat, 
      latitude, 
      longitude, 
      description, 
      image_urls, 
      phone, 
      manager, 
      stock, 
      orders 
    } = req.body;
    
    const userId = req.user.id;
    
    const projectData = {
      id,
      name,
      type: type || 'pejabat',
      status: status || 'active',
      address: address || null,
      city: city || null,
      negri: negri || null,
      negara: negara || 'Malaysia',
      syarikat: syarikat || null,
      latitude: latitude || null,
      longitude: longitude || null,
      description: description || null,
      image_urls: image_urls || [],
      phone: phone || null,
      manager: manager || null,
      stock: stock || 0,
      orders: orders || 0,
      userId
    };
    
    const project = await Project.create(projectData);
    
    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      type, 
      status, 
      address, 
      city, 
      negri, 
      negara, 
      syarikat, 
      latitude, 
      longitude, 
      description, 
      image_urls, 
      phone, 
      manager, 
      stock, 
      orders 
    } = req.body;
    
    const project = await Project.findOne({ where: { id } });
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (negri !== undefined) updateData.negri = negri;
    if (negara !== undefined) updateData.negara = negara;
    if (syarikat !== undefined) updateData.syarikat = syarikat;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (description !== undefined) updateData.description = description;
    if (image_urls !== undefined) updateData.image_urls = image_urls;
    if (phone !== undefined) updateData.phone = phone;
    if (manager !== undefined) updateData.manager = manager;
    if (stock !== undefined) updateData.stock = stock;
    if (orders !== undefined) updateData.orders = orders;
    
    await project.update(updateData);
    
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({ where: { id } });
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    await project.destroy();
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get project statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Project.count();
    const active = await Project.count({ where: { status: 'active' } });
    const inactive = await Project.count({ where: { status: 'inactive' } });
    const pending = await Project.count({ where: { status: 'pending' } });
    const completed = await Project.count({ where: { status: 'completed' } });
    
    // Get type statistics
    const typeStats = await Project.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type'],
      raw: true
    });
    
    // Get negri statistics
    const negriStats = await Project.findAll({
      attributes: [
        'negri',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['negri'],
      raw: true
    });
    
    res.json({ 
      success: true, 
      data: {
        total,
        active,
        inactive,
        pending,
        completed,
        typeStats,
        negriStats
      }
    });
  } catch (error) {
    console.error('Error fetching project statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
