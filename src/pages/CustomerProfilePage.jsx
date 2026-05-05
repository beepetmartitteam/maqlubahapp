import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Divider,
  CircularProgress,
  Avatar,
} from '@mui/material'
import {
  MoreHoriz as MoreHorizIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { customerAPI } from '../api/customer'
import { notesAPI } from '../api/notes'
import { authAPI } from '../api/auth'

const CustomerProfilePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  console.log('CustomerProfilePage - ID from URL:', id)
  const [customer, setCustomer] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch customer data and notes
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get authentication token
        const token = authAPI.getToken()
        if (!token) {
          throw new Error('No authentication token found')
        }
        
        // Fetch customer details
        console.log('Fetching customer with ID:', id, 'Token:', token ? 'exists' : 'missing')
        console.log('customerAPI methods:', Object.keys(customerAPI))
        const customerData = await customerAPI.getCustomerById(id, token)
        console.log('Customer data fetched:', customerData)
        console.log('Customer ID from data:', customerData.id)
        setCustomer(customerData)
        
        // Notes are already included in customerData.customerNotes
        if (customerData && customerData.customerNotes) {
          setNotes(customerData.customerNotes)
        }
        
      } catch (err) {
        console.error('Failed to fetch customer data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomerData()
    }
  }, [id])

  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: 'background.default',
          gap: 2
        }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
          <IconButton onClick={() => navigate('/customer')}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </ThemeProvider>
    )
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
             
        
        {/* Navigation Bar */}
        <AppBar position="fixed" sx={{ 
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate('/customer')}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h1" sx={{ fontSize: '20px', fontWeight: 600, bgcolor: 'background.paper', color: 'text.primary'}}>
                  {customer ? customer.name : 'Loading...'}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => navigate(`/customer-edit/${id}`)}>
              <EditIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ 
          pt: '40px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%'
        }}>
          {/* Customer Profile Picture */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar 
              src={customer?.avatarUrl}
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'background.default',
                border: '2px solid',
                borderColor: 'divider',
                fontSize: '48px'
              }}
            >
              {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>
              {customer ? customer.name : 'Loading...'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.location || 'No location specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Image Cards Slider
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            p: 2, 
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            }
          }}>
            {customer && customer.customerNotes && customer.customerNotes.length > 0 ? customer.customerNotes.map((note) => (
              <Card key={note.id} sx={{ 
                minWidth: 280, 
                maxWidth: 280,
                position: 'relative',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                {note.images && note.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={note.images[0].startsWith('http') ? note.images[0] : `http://localhost:5000${note.images[0]}`}
                    alt={note.caption}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <MoreHorizIcon />
                  </IconButton>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                        {note.caption || 'Customer Note'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {note.note || 'No description'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(note.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            )) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No customer notes yet
                </Typography>
              </Box>
            )}
          </Box>
           */}

       {/* Notes Section */}
          <Box 
            sx={{ 
              p: 2, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'background.paper',
              }
            }}
            onClick={() => {
          const customerId = customer ? customer.id : id
          console.log('Navigating to notes with customer ID:', customerId)
          navigate(`/customer-notes/${customerId}`)
        }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                  Logs meeting
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ color: 'text.secondary' }} />
            </Box>
          </Box>

             {/* Location */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Location
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.location || 'No Location specified' : 'Loading...'}
            </Typography>
          </Box>


          {/* Address */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.address || 'No address specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Phone */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              No. Telefon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.phone || 'No phone specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Email */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.email || 'No email specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Umur */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Umur
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.age || 'Not specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Kerjaya */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Kerjaya
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.kerjaya || 'Not specified' : 'Loading...'}
            </Typography>
          </Box>

          {/* Kerjasama */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Kerjasama
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.kerjasama || 'No cooperation details' : 'Loading...'}
            </Typography>
          </Box>

          {/* Kehidupan Keluarga */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: 'left'
          }}>
            <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
              Family
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              {customer ? customer.kehidupanKeluarga || 'No family details' : 'Loading...'}
            </Typography>
          </Box>

         
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

export default CustomerProfilePage
