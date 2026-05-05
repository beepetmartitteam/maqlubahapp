# Maqlubah Backend API

Complete Node.js backend with MySQL database and OAuth authentication for the Maqlubah Customer Management React application.

## Features

### 🔐 Authentication
- **Local Authentication** - Email/password login with bcrypt
- **Google OAuth 2.0** - Google account integration
- **Facebook OAuth** - Facebook account integration
- **JWT Tokens** - Secure API authentication
- **Session Management** - Express-session for user sessions

### 📊 Database Integration
- **MySQL Database** - Complete schema with relationships
- **Customer Management** - CRUD operations for customers
- **Notes System** - Multi-image support for customer notes
- **User Profiles** - User account management

### 📁 File Upload
- **Multer Integration** - Secure file uploads
- **Image Processing** - Multiple image support
- **File Validation** - Image type and size validation
- **Static Serving** - Upload directory access

### 🛡️ Security Features
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **Password Hashing** - bcrypt encryption

## Installation

### Prerequisites
- Node.js 14+
- MySQL 8.0+
- npm or yarn

### Setup Steps

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database and OAuth credentials
```

3. **Setup Database**
```bash
mysql -u root -p < database.sql
```

4. **Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Local login
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Facebook OAuth initiation
- `GET /auth/facebook/callback` - Facebook OAuth callback

### Customers
- `GET /api/customers` - Get all customers (authenticated)
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Customer Notes
- `GET /api/customers/:id/notes` - Get customer notes
- `POST /api/customers/:id/notes` - Create note with images

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Utility
- `GET /api/health` - Health check endpoint

## Database Schema

### Tables
- **users** - User accounts and authentication
- **customers** - Customer information
- **customer_notes** - Customer meeting notes
- **note_images** - Individual image records
- **sessions** - Express session storage
- **oauth_users** - OAuth provider mapping

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=maqlubah_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Server
PORT=5000
NODE_ENV=development
```

## Frontend Integration

### React App Configuration
Update your React app to connect to this backend:

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Login request
const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

// Authenticated request
const getCustomers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};
```

## Security Considerations

### Production Deployment
1. Use HTTPS in production
2. Set strong JWT secrets
3. Configure proper CORS origins
4. Use environment variables for sensitive data
5. Implement request logging and monitoring
6. Set up database connection pooling
7. Use reverse proxy (nginx/Apache)

### OAuth Setup
1. **Google OAuth**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://yourdomain.com/auth/google/callback`

2. **Facebook OAuth**
   - Go to Facebook Developers
   - Create new app
   - Add redirect URI: `http://yourdomain.com/auth/facebook/callback`

## Development

### Testing
```bash
# Test API endpoints
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check health
curl http://localhost:5000/api/health
```

### Debug Mode
Set `NODE_ENV=development` for detailed error logging and auto-restart with nodemon.

## File Structure
```
backend/
├── package.json          # Dependencies and scripts
├── .env                 # Environment variables
├── server.js            # Main application server
├── database.sql          # Database schema
├── uploads/             # File upload directory
└── README.md            # This documentation
```

## Contributing

1. Follow coding standards
2. Write tests for new features
3. Update documentation
4. Use meaningful commit messages
5. Test thoroughly before deployment
