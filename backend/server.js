const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const validator = require('validator');
const Joi = require('joi');
require('dotenv').config();

// Import models and database
const { sequelize, User, Customer, CustomerNote, OAuthUser } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const jualanSabunRoutes = require('./routes/jualan-sabun');
const ahliRoutes = require('./routes/ahli');
const companyManagementRoutes = require('./routes/company-management');
const memberRoutes = require('./routes/member');
const todoListRoutes = require('./routes/todo-list');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS Origin:', origin);

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allowed origins for both development and production
    const allowedOrigins = [
      'https://gemilang.beeasy.id', // Production
      'https://gemilang-api.beeasy.id',
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://localhost:5550',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5550'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  location: Joi.string().max(255)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const customerSchema = Joi.object({
  name: Joi.string().max(255).required(),
  location: Joi.string().max(255),
  birthDate: Joi.date().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().optional(),
  age: Joi.string().max(10).optional(),
  kerjaya: Joi.string().optional(),
  kerjasama: Joi.string().optional(),
  kehidupanKeluarga: Joi.string().optional(),
  notes: Joi.string().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

const noteSchema = Joi.object({
  caption: Joi.string().max(500).optional(),
  note: Joi.string().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Maqlubah API Server',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      jualan_sabun: '/api/jualan',
      company_management: '/api/company-management',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'connected',
      auth: 'available',
      customers: 'available',
      jualan_sabun: 'available',
      company_management: 'available',
      members: 'available',
      todo_list: 'available'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/jualan', jualanSabunRoutes);
app.use('/api/ahli', ahliRoutes);
app.use('/api/company-management', companyManagementRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/todo-list', todoListRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    available: {
      auth: '/api/auth',
      customers: '/api/customers',
      jualan_sabun: '/api/jualan',
      company_management: '/api/company-management',
      members: '/api/members',
      todo_list: '/api/todo-list',
      health: '/api/health'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5557;

// Sync database and start server
sequelize.sync({ 
  force: false,
  alter: false,
  logging: console.log
}).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Maqlubah API Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   🔐 Authentication: /api/auth`);
    console.log(`   👥 Customer Management: /api/customers`);
    console.log(`   🧼 Jualan Sabun: /api/jualan`);
    console.log(`   👨‍👩‍👧‍👦 Member Management: /api/members`);
    console.log(`   ✓ Todo List: /api/todo-list`);
    console.log(`   ❤️  Health Check: /api/health`);
    console.log(`🌐 Server: http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ Unable to sync database:', error);
  console.log('⚠️  Continuing without sync...');
  
  // Start server anyway even if sync fails
  app.listen(PORT, () => {
    console.log(`🚀 Maqlubah API Server running on port ${PORT}`);
    console.log(`⚠️  Database may not be fully synchronized`);
  });
});

module.exports = app;
