import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth'
import { customerAPI } from '../api/customer'
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Paper,
  Divider,
  SvgIcon,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Home as HomeIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  Article as ArticleIcon,
} from '@mui/icons-material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import theme from '../theme'

const CustomerPageList = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (authAPI.isAuthenticated()) {
          const token = authAPI.getToken()
          const customerData = await customerAPI.getCustomers(token)
          setCustomers(customerData)
        } else {
          // If not authenticated, show empty array
          setCustomers([])
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleCustomerClick = (customerId) => {
    navigate(`/customer-profile/:id=${customerId}`)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: '#FFF',
        minHeight: '100vh',
        maxWidth: '390px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Navigation Bar */}
        <AppBar position="fixed" sx={{ 
          top: '4px',
          height: '76px',
          minHeight: '76px',
          zIndex: 1099,
          '& .MuiToolbar-root': {
            minHeight: '76px',
            height: '76px',
            padding: '4px 8px 12px 16px',
          }
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
             <Typography variant="h2"  sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                    CUSTOMERS
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate('/customer-add')}>
                <AddIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ 
          pt: '50px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%'
        }}>
          {customers.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ width: '100%' }}>
              {/* Section Header */}
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'left', 
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h2">
                  {group.title}
                </Typography>
                <Button variant="text" size="small">
                  View all
                </Button>
              </Box>

              {/* Customer List */}
              <List sx={{ p: 0 }}>
                {group.customers.map((customer) => (
                  <ListItem
                    key={customer.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    width: '100%',
                      px: 1,
                      py: 1.5
                    }}
                  >
                    <ListItemAvatar  onClick={() => navigate('/customer-profile/'+customer.id)}>
                      <Avatar 
                        src={customer.avatarUrl}
                        sx={{ 
                          bgcolor: 'background.paper', 
                          color: 'text.primary',
                          width: 40,
                          height: 40
                        }}
                      >
                        {customer.initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customer.name}
                      secondary={customer.location}
                      primaryTypographyProps={{
                        variant: 'h3',
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                       onClick={() => navigate('/customer-profile/'+customer.id)}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => navigate('/customer-notes/'+customer.id)}
                      sx={{ mr: 1 }}
                      title="View Notes"
                    >
                      <ArticleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate('/customer-profile/'+customer.id)}
                      title="View Profile"
                    >
                      <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
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

export default CustomerPageList
