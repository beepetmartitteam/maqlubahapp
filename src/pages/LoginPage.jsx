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
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      const data = await authAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.message);
      
      // Better error messages for mobile
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Connection blocked. Please contact support.';
      }
      
      alert(errorMessage);
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    // Navigate to forgot password page or show modal
  }

  const handleSignUp = () => {
    navigate('/register')
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
       
        {/* Login Form */}
        <Box sx={{ 
          pt: '76px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}>
          <Paper sx={{ 
            p: 4, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            width: '100%',
            maxWidth: '320px'
          }}>
            {/* Logo/Avatar Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '32px'
              }}>
                <LoginIcon />
              </Avatar>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', textAlign: 'center' }}>
                Sign in to continue to your account
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                variant="outlined"
                size="small"
                required
                placeholder="Enter your email"
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                variant="outlined"
                size="small"
                required
                placeholder="Enter your password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right' }}>
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPassword}
                  sx={{ fontSize: '14px' }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{ py: 1.5 }}
                disabled={!formData.email || !formData.password}
              >
                LOGIN
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Sign Up Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', mb: 1 }}>
                Don't have an account?
              </Typography>
              <Link
                component="button"
                type="button"
                onClick={handleSignUp}
                sx={{ fontSize: '14px', fontWeight: 600 }}
              >
                Sign Up
              </Link>
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
            width: '134px',
            height: '5px',
            backgroundColor: 'text.primary',
            borderRadius: '100px',
            opacity: 0.3,
          }} />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default LoginPage
