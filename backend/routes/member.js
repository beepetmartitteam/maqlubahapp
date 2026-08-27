const express = require('express');
const { Op } = require('sequelize');
const { User, Member } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../models');

const router = express.Router();

// Apply authentication middleware to all routes
//router.use(authenticateToken);

// Static paths MUST be registered before `/:id` or Express will treat "stats" as an id.
router.get('/stats', async (req, res) => {
  try {
    // Filter by userId for non-admin users
    const whereClause = {};
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      whereClause.userId = req.user.id;
    }

    const totalMembers = await Member.count({ where: whereClause });
    const activeMembers = await Member.count({ where: { ...whereClause, status: 'active' } });
    const inactiveMembers = await Member.count({ where: { ...whereClause, status: 'inactive' } });
    const pendingMembers = await Member.count({ where: { ...whereClause, status: 'pending' } });

    const members = await Member.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('married_children')), 'totalMarriedChildren'],
        [sequelize.fn('SUM', sequelize.col('unmarried_children')), 'totalUnmarriedChildren']
      ]
    });

    const totalChildren = (members[0]?.dataValues?.totalMarriedChildren || 0) +
      (members[0]?.dataValues?.totalUnmarriedChildren || 0);

    const uniqueStates = await Member.findAll({
      where: { ...whereClause, state: { [Op.ne]: null } },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('state')), 'state']]
    });

    const statesCovered = uniqueStates.length;

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        pendingMembers,
        totalChildren,
        statesCovered
      }
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, state, status } = req.query;

    const whereClause = {};

    // Filter by userId for non-admin users
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      whereClause.userId = req.user.id;
    }

    if (q) {
      whereClause[Op.or] = [
        { husbandName: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { currentJob: { [Op.like]: `%${q}%` } }
      ];
    }

    if (state) {
      whereClause.state = state;
    }

    if (status) {
      whereClause.status = status;
    }

    const members = await Member.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'role']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/filter', async (req, res) => {
  try {
    const { state, status } = req.query;

    const whereClause = {};

    // Filter by userId for non-admin users
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      whereClause.userId = req.user.id;
    }

    if (state) {
      whereClause.state = state;
    }

    if (status) {
      whereClause.status = status;
    }

    const members = await Member.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'role']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Error filtering members:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/health', async (req, res) => {
  try {
    const memberCount = await Member.count();

    res.json({
      success: true,
      message: 'Member API is healthy',
      timestamp: new Date().toISOString(),
      data: {
        totalMembers: memberCount
      }
    });
  } catch (error) {
    console.error('Member health check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all members
router.get('/', async (req, res) => {
  try {
    // Filter by userId for non-admin users
    const whereClause = {};
    
    // Check if user is admin
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!isAdmin) {
      // Non-admin users can only see their own members
      whereClause.userId = req.user.id;
    }

    const members = await Member.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'role']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findOne({
      where: { id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new member
router.post('/', async (req, res) => {
  try {
    // Ensure userId comes from the logged-in user
    if (!req.user || !req.user.id) {
      console.error('Authentication failed: req.user or req.user.id is missing');
      return res.status(401).json({ 
        success: false, 
        error: 'User authentication required' 
      });
    }

    console.log('Creating member for user:', req.user.id);
    console.log('Request body:', JSON.stringify(req.body));

    const memberData = { ...req.body };
    
    // Remove userId from request body if it was sent (security measure)
    delete memberData.userId;
    
    // Set userId from authenticated user
    memberData.userId = req.user.id;
    
    console.log('Final member data:', JSON.stringify(memberData));
    
    const member = await Member.create(memberData);
    
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      memberId: member.id
    });
  } catch (error) {
    console.error('Error creating member:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memberData = { ...req.body };
    delete memberData.user;
    delete memberData.id;

    const [updatedCount] = await Member.update(memberData, {
      where: { id }
    });

    if (updatedCount === 0) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fetch and return updated member data
    const updatedMember = await Member.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName']
      }]
    });

    res.json({ 
      success: true, 
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await Member.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ 
      success: true, 
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
