const express = require('express');
const { User, Customer, CustomerNote } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all customers with user grouping
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }, {
        model: CustomerNote,
        as: 'customerNotes',
        required: false,
        order: [['created_at', 'DESC']]
      }],
      order: [['created_at', 'DESC']]
    });

    // Group customers by user
    const customerGroups = [];
    const uniqueUsers = [...new Map(customers.map(customer => [customer.user.id, customer.user])).values()];
    
    uniqueUsers.forEach(user => {
      const userCustomers = customers.filter(customer => customer.user.id === user.id);
      
      customerGroups.push({
        title: `${user.firstName} ${user.lastName}`,
        userId: user.id,
        customers: userCustomers.map(customer => ({
          id: customer.id,
          name: customer.name,
          location: customer.location || 'Unknown',
          initial: customer.name ? customer.name.charAt(0).toUpperCase() : 'U',
          avatarUrl: customer.avatarUrl
        }))
      });
    });

    res.json({ success: true, data: customerGroups });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findOne({
      where: { id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }, {
        model: CustomerNote,
        as: 'customerNotes',
        order: [['created_at', 'DESC']]
      }]
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const customerData = { ...req.body, userId: req.user.id };
    
    const customer = await Customer.create(customerData);
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customerId: customer.id
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { images, ...customerData } = req.body;
    
    // Handle avatarUrl from images array
    if (images && images.length > 0) {
      customerData.avatarUrl = images[0];
    }
    
    const [updatedCount] = await Customer.update(customerData, {
      where: { id }
    });

    if (updatedCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Fetch and return updated customer data
    const updatedCustomer = await Customer.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }, {
        model: CustomerNote,
        as: 'customerNotes',
        required: false,
        order: [['created_at', 'DESC']]
      }]
    });

    res.json({ 
      success: true, 
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await Customer.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get customer notes
router.get('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notes = await CustomerNote.findAll({
      where: { customerId: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching customer notes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create customer note
router.post('/:id/notes', async (req, res) => {
  try {
    const noteData = { 
      ...req.body, 
      customerId: req.params.id, 
      userId: req.user?.id || 1 // Default to user ID 1 if not authenticated
    };
    
    const note = await CustomerNote.create(noteData);
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      noteId: note.id
    });
  } catch (error) {
    console.error('Error creating customer note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete note
router.delete('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    
    // Check if note exists and belongs to current user
    const note = await CustomerNote.findOne({
      where: { id: noteId }
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    await CustomerNote.destroy({
      where: { id: noteId }
    });

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
