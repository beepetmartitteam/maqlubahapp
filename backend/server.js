const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
require('dotenv').config();

// Import models and database
const {
  sequelize,
  User,
  Customer,
  CustomerNote,
  OAuthUser
} = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const jualanSabunRoutes = require('./routes/jualan-sabun');
const ahliRoutes = require('./routes/ahli');
const companyManagementRoutes = require('./routes/company-management');
const memberRoutes = require('./routes/member');
const todoListRoutes = require('./routes/todo-list');
const projectRoutes = require('./routes/project');

const app = express();

/* =========================================================
   SECURITY
========================================================= */

app.use(helmet());

/* =========================================================
   CORS CONFIGURATION
========================================================= */

// Daftar frontend/domain yang diperbolehkan mengakses API
const allowedOrigins = [
  // Production
  'https://gemilang.beeasy.id',
  'https://www.gemilang.beeasy.id',

  'https://gemilang-api.beeasy.id',
  'https://www.gemilang-api.beeasy.id',

  // MAP
  'https://map.beeasy.id',

  // Main website
  'https://beeasy.id',
  'https://www.beeasy.id',

  // Development
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5550',
  'http://localhost:5555',
  'http://localhost:5557',

  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5550',
  'http://127.0.0.1:5555',
  'http://127.0.0.1:5557'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin:', origin || 'No Origin');

    /*
     * Request tanpa Origin:
     * - Postman
     * - curl
     * - mobile application
     * - server-to-server
     */
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS Allowed:', origin);
      return callback(null, true);
    }

    console.log('❌ CORS Blocked:', origin);

    /*
     * Jangan menggunakan:
     *
     * callback(new Error('Not allowed by CORS'));
     *
     * karena ini bisa menyebabkan response 500.
     *
     * false akan membuat CORS menolak origin tersebut
     * tanpa membuat error server.
     */
    return callback(null, false);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],

  exposedHeaders: [
    'Content-Length',
    'Content-Type'
  ],

  optionsSuccessStatus: 204
};

// CORS middleware
app.use(cors(corsOptions));

// Handle preflight request
app.options('*', cors(corsOptions));

/* =========================================================
   REQUEST LOGGER
========================================================= */

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Origin: ${
      req.headers.origin || 'No Origin'
    }`
  );

  next();
});

/* =========================================================
   RATE LIMITING
========================================================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many requests from this IP, please try again after 15 minutes'
  }
});

app.use('/api/', limiter);

/* =========================================================
   BODY PARSING
========================================================= */

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

/* =========================================================
   STATIC FILES
========================================================= */

app.use(
  '/uploads',
  express.static(uploadDir)
);

/* =========================================================
   VALIDATION SCHEMAS
========================================================= */

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  firstName: Joi.string()
    .max(100)
    .required(),

  lastName: Joi.string()
    .max(100)
    .required(),

  location: Joi.string()
    .max(255)
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

const customerSchema = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),

  location: Joi.string()
    .max(255),

  birthDate: Joi.date()
    .optional(),

  address: Joi.string()
    .optional(),

  phone: Joi.string()
    .max(20)
    .optional(),

  email: Joi.string()
    .email()
    .optional(),

  age: Joi.string()
    .max(10)
    .optional(),

  kerjaya: Joi.string()
    .optional(),

  kerjasama: Joi.string()
    .optional(),

  kehidupanKeluarga: Joi.string()
    .optional(),

  notes: Joi.string()
    .optional(),

  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
});

const noteSchema = Joi.object({
  caption: Joi.string()
    .max(500)
    .optional(),

  note: Joi.string()
    .optional(),

  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
});

/* =========================================================
   MULTER UPLOAD CONFIGURATION
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        extension
    );
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize:
      parseInt(process.env.MAX_FILE_SIZE, 10) ||
      5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype &&
      file.mimetype.startsWith('image/')
    ) {
      cb(null, true);
    } else {
      cb(
        new Error('Only image files are allowed!'),
        false
      );
    }
  }
});

// Make upload middleware available globally
app.locals.upload = upload;

/* =========================================================
   ROOT ENDPOINT
========================================================= */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Maqlubah API Server',
    version: '2.0.0',
    status: 'running',

    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      jualan_sabun: '/api/jualan',
      ahli: '/api/ahli',
      company_management: '/api/company-management',
      members: '/api/members',
      todo_list: '/api/todo-list',
      projects: '/api/projects',
      health: '/api/health'
    }
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', async (req, res) => {
  let databaseStatus = 'connected';

  try {
    await sequelize.authenticate();
  } catch (error) {
    databaseStatus = 'disconnected';
  }

  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),

    services: {
      database: databaseStatus,
      auth: 'available',
      customers: 'available',
      jualan_sabun: 'available',
      ahli: 'available',
      company_management: 'available',
      members: 'available',
      todo_list: 'available',
      projects: 'available'
    }
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/customers',
  customerRoutes
);

app.use(
  '/api/jualan',
  jualanSabunRoutes
);

app.use(
  '/api/ahli',
  ahliRoutes
);

app.use(
  '/api/company-management',
  companyManagementRoutes
);

app.use(
  '/api/members',
  memberRoutes
);

app.use(
  '/api/todo-list',
  todoListRoutes
);

app.use(
  '/api/projects',
  projectRoutes
);

/* =========================================================
   MULTER / FILE UPLOAD ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer Error:', err);

    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }

  if (
    err &&
    err.message === 'Only image files are allowed!'
  ) {
    console.error('❌ File Type Error:', err.message);

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
});

/* =========================================================
   GENERAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || 'Something went wrong!',

    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined
  });
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: 'Endpoint not found',

    path: req.originalUrl,

    method: req.method,

    available: {
      auth: '/api/auth',
      customers: '/api/customers',
      jualan_sabun: '/api/jualan',
      ahli: '/api/ahli',
      company_management:
        '/api/company-management',
      members: '/api/members',
      todo_list: '/api/todo-list',
      projects: '/api/projects',
      health: '/api/health'
    }
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 5557;

const startServer = async () => {
  try {
    /*
     * Connect database
     */
    await sequelize.authenticate();

    console.log(
      '✅ Database connection established successfully.'
    );

    /*
     * Sync database
     */
    await sequelize.sync({
      force: false,
      alter: false,
      logging: console.log
    });

    console.log(
      '✅ Database synchronized successfully.'
    );
  } catch (error) {
    console.error(
      '❌ Unable to connect/sync database:',
      error
    );

    console.log(
      '⚠️ Starting server anyway...'
    );
  }

  /*
   * Start Express server
   */
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log(
      '=========================================='
    );
    console.log(
      '🚀 Maqlubah API Server'
    );
    console.log(
      '=========================================='
    );

    console.log(
      `📡 Port: ${PORT}`
    );

    console.log(
      `🌍 Environment: ${
        process.env.NODE_ENV || 'development'
      }`
    );

    console.log(
      `🌐 Local: http://localhost:${PORT}`
    );

    console.log(
      `❤️ Health: http://localhost:${PORT}/api/health`
    );

    console.log('');
    console.log(
      '📋 Available endpoints:'
    );

    console.log(
      '   🔐 Authentication: /api/auth'
    );

    console.log(
      '   👥 Customer Management: /api/customers'
    );

    console.log(
      '   🧼 Jualan Sabun: /api/jualan'
    );

    console.log(
      '   👨‍👩‍👧‍👦 Ahli: /api/ahli'
    );

    console.log(
      '   🏢 Company Management: /api/company-management'
    );

    console.log(
      '   👥 Member Management: /api/members'
    );

    console.log(
      '   ✓ Todo List: /api/todo-list'
    );

    console.log(
      '   📁 Projects: /api/projects'
    );

    console.log('');
    console.log(
      '🌐 Allowed CORS origins:'
    );

    allowedOrigins.forEach((origin) => {
      console.log(`   ✅ ${origin}`);
    });

    console.log(
      '=========================================='
    );
    console.log('');
  });
};

startServer();

module.exports = app;