const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
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

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Allowed origins for both development and production
        const allowedOrigins = [
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

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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

// Serve static files
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

// Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return done(null, false, { message: 'Email not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [oauthUser] = await sequelize.models.OAuthUser.findOrCreate({
            where: {
                provider: 'google',
                providerId: profile.id
            },
            defaults: {
                provider: 'google',
                providerId: profile.id
            }
        });

        if (oauthUser.user) {
            return done(null, oauthUser.user);
        }

        // Create new user
        const newUser = await User.create({
            email: profile.emails[0],
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            oauthProvider: 'google',
            emailVerified: true
        });

        oauthUser.user = newUser;
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [oauthUser] = await sequelize.models.OAuthUser.findOrCreate({
            where: {
                provider: 'facebook',
                providerId: profile.id
            },
            defaults: {
                provider: 'facebook',
                providerId: profile.id
            }
        });

        if (oauthUser.user) {
            return done(null, oauthUser.user);
        }

        // Create new user
        const newUser = await User.create({
            email: profile.emails[0],
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            oauthProvider: 'facebook',
            emailVerified: true
        });

        oauthUser.user = newUser;
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

// JWT Strategy for API authentication
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token format is invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

// Routes

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: value.email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create(value);

        res.status(201).json({ 
            message: 'User created successfully',
            userId: user.id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location
            }
        });
    })(req, res, next);
});

// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

// Customer management routes
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
       

        const customers = await Customer.findAll({
            where: { userId: req.user.userId },
            order: [['created_at', 'DESC']],
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

        // Group customers by user and create customer groups
        const customerGroups = [];
        
        // Get unique users from customers
        const uniqueUsers = [...new Map(customers.map(customer => [customer.user.id, customer.user])).values()];
        
        uniqueUsers.forEach(user => {
            const userCustomers = customers.filter(customer => customer.user.id === user.id);
            
            customerGroups.push({
                title: `${user.firstName} ${user.lastName}`,
                customers: userCustomers.map(customer => ({
                    id: customer.id,
                    name: customer.name,
                    location: customer.location || 'Unknown',
                    initial: customer.name ? customer.name.charAt(0).toUpperCase() : 'U',
                    avatarUrl: customer.avatarUrl
                }))
            });
        });

        res.json(customerGroups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get customer by ID
app.get('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
        const customer = await Customer.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.userId 
            },
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
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const { error, value } = customerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Handle Cloudinary URLs from frontend
        const images = value.images || [];
        const avatarUrl = images.length > 0 ? images[0] : null;

        const customer = await Customer.create({
            ...value,
            userId: req.user.userId,
            avatarUrl: avatarUrl
        });

        res.status(201).json({
            message: 'Customer created successfully',
            customerId: customer.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = customerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Handle Cloudinary URLs from frontend
        const images = value.images || [];
        const avatarUrl = images.length > 0 ? images[0] : null;

        const [updatedCount] = await Customer.update(
            { ...value, avatarUrl },
            { where: { id, userId: req.user.userId } }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await Customer.destroy({
            where: { id, userId: req.user.userId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Customer notes routes
app.get('/api/customers/:id/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await CustomerNote.findAll({
            where: { customerId: req.params.id },
             include: {
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName']
            },
            order: [['created_at', 'DESC']]
        });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/customers/:id/notes', authenticateToken, async (req, res) => {
    try {
        const { error, value } = noteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Handle images from Cloudinary URLs (already uploaded from frontend)
        const images = value.images || [];

        const note = await CustomerNote.create({
            ...value,
            customerId: req.params.id,
            userId: req.user.userId,
            images: images
        });

        res.status(201).json({
            message: 'Note created successfully',
            noteId: note.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete note route
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        
        // First check if note exists and belongs to current user
        const note = await CustomerNote.findOne({
            where: { 
                id: noteId,
                userId: req.user.userId 
            }
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        // Delete the note
        await CustomerNote.destroy({
            where: { id: noteId }
        });

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Profile routes
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'location', 'avatarUrl', 'emailVerified']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/profile', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        const { firstName, lastName, location } = req.body;

        let avatarUrl = null;
        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
        }

        const [updatedCount] = await User.update(
            { firstName, lastName, location, avatarUrl },
            { where: { id: req.user.userId } }
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5555;

// Sync database and start server
sequelize.sync({ 
    force: false,
    alter: false,
    logging: console.log
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
}).catch(error => {
    console.error('Unable to sync database:', error);
    console.log('Continuing without sync...');
    
    // Start server anyway even if sync fails
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
});
