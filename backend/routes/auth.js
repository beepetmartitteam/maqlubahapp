const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: user.id
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log(user)

    res.json({
      success: true,
      message: 'Login successful----',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        allowed_menu: user.allowed_menu
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const [updatedCount] = await User.update(req.body, {
      where: { id: decoded.userId }
    });

    if (updatedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
