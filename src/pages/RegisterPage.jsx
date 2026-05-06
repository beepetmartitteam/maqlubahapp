import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOff,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    setError('') // Clear error when user types
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const data = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', data);
      
      // Show success message and redirect to login
      alert('Registration successful! Please login with your new account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.message);
      
      // Better error messages for mobile
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Connection blocked. Please contact support.';
      } else if (error.message.includes('email') && error.message.includes('exists')) {
        errorMessage = 'Email already exists. Please use a different email or login.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: 'background.default',
        minHeight: '100vh',
        maxWidth: '390px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
       
        {/* Header */}
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'divider',
            maxWidth: '390px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate('/login')}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Create Account
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Registration Form */}
        <Box sx={{ 
          pt: '76px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2
        }}>
          
          {/* Form Container */}
          <Paper sx={{ 
            width: '100%',
            maxWidth: '350px',
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>

            {/* Avatar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: 64, 
                height: 64,
                fontSize: '32px'
              }}>
                <PersonAddIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ 
              textAlign: 'center', 
              mb: 1, 
              fontWeight: 600,
              color: 'text.primary'
            }}>
            </Typography>
            
            <Typography variant="body2" sx={{ 
              textAlign: 'center', 
              mb: 3, 
              color: 'text.secondary'
            }}>
              Create your account to get started
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* First Name */}
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                variant="outlined"
                size="small"
                required
                disabled={loading}
                autoComplete="given-name"
              />

              {/* Last Name */}
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                variant="outlined"
                size="small"
                required
                disabled={loading}
                autoComplete="family-name"
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                variant="outlined"
                size="small"
                required
                disabled={loading}
                autoComplete="email"
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                variant="outlined"
                size="small"
                required
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={handleTogglePasswordVisibility}
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                variant="outlined"
                size="small"
                required
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={handleToggleConfirmPasswordVisibility}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />

              {/* Submit Button */}
              <Button 
                type="submit"
                variant="contained" 
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  mt: 2,
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Creating Account...
                  </Box>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component="button"
                    type="button"
                    onClick={handleBackToLogin}
                    sx={{ 
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Home Indicator */}
        <Box sx={{
          position: 'fixed',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1101,
          maxWidth: '390px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Box sx={{
            width: 134,
            height: 5,
            backgroundColor: 'text.primary',
            borderRadius: 100,
            opacity: 0.3
          }} />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default RegisterPage
