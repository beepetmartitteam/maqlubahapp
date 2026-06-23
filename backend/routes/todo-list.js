const express = require('express');
const { TodoList, Company, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all todo items
router.get('/', async (req, res) => {
  try {
    const { companyId, completed, assignee, search } = req.query;
    
    const whereClause = {};
    
    if (companyId) {
      whereClause.company_id = companyId;
    }
    
    if (completed !== undefined) {
      whereClause.completed = completed === 'true';
    }
    
    if (assignee) {
      whereClause.assignee = assignee;
    }
    
    if (search) {
      whereClause.text = {
        [require('sequelize').Op.like]: `%${search}%`
      };
    }
    
    const todoItems = await TodoList.findAll({
      where: whereClause,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: todoItems });
  } catch (error) {
    console.error('Error fetching todo items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get todo item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const todoItem = await TodoList.findOne({
      where: { id },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!todoItem) {
      return res.status(404).json({ success: false, message: 'Todo item not found' });
    }

    res.json({ success: true, data: todoItem });
  } catch (error) {
    console.error('Error fetching todo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new todo item
router.post('/', async (req, res) => {
  try {
    const { text, assignee, priority, dueDate, category, companyId } = req.body;
    
    const todoData = {
      text,
      assignee: assignee || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category || null,
      companyId: companyId || null,
      userId: req.user.id,
      completed: false
    };
    
    const todoItem = await TodoList.create(todoData);
    
    // Fetch the created item with associations
    const createdItem = await TodoList.findOne({
      where: { id: todoItem.id },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });
    
    res.status(201).json({
      success: true,
      message: 'Todo item created successfully',
      data: createdItem
    });
  } catch (error) {
    console.error('Error creating todo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update todo item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, assignee, completed, priority, dueDate, category, companyId } = req.body;
    
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (category !== undefined) updateData.category = category;
    if (companyId !== undefined) updateData.companyId = companyId;
    
    const [updatedCount] = await TodoList.update(updateData, {
      where: { id }
    });

    if (updatedCount === 0) {
      return res.status(404).json({ success: false, message: 'Todo item not found' });
    }

    // Fetch and return updated todo item
    const updatedItem = await TodoList.findOne({
      where: { id },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    res.json({ 
      success: true, 
      message: 'Todo item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating todo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle todo item completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    const todoItem = await TodoList.findOne({ where: { id } });
    
    if (!todoItem) {
      return res.status(404).json({ success: false, message: 'Todo item not found' });
    }
    
    await TodoList.update(
      { completed: !todoItem.completed },
      { where: { id } }
    );

    // Fetch updated item
    const updatedItem = await TodoList.findOne({
      where: { id },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    res.json({ 
      success: true, 
      message: 'Todo item toggled successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error toggling todo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete todo item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await TodoList.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Todo item not found' });
    }

    res.json({ success: true, message: 'Todo item deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get todo statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { companyId } = req.query;
    
    const whereClause = companyId ? { company_id: companyId } : {};
    
    const total = await TodoList.count({ where: whereClause });
    const completed = await TodoList.count({ 
      where: { ...whereClause, completed: true } 
    });
    const pending = await TodoList.count({ 
      where: { ...whereClause, completed: false } 
    });
    
    // Get assignee statistics
    const assigneeStats = await TodoList.findAll({
      where: whereClause,
      attributes: [
        'assignee',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').literal('CASE WHEN completed = true THEN 1 ELSE 0 END')), 'completed_count']
      ],
      group: ['assignee'],
      raw: true
    });

    res.json({ 
      success: true, 
      data: {
        total,
        completed,
        pending,
        assigneeStats
      }
    });
  } catch (error) {
    console.error('Error fetching todo statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
