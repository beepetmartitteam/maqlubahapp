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
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import theme from '../theme'

const CustomerPageList = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [users, setUsers] = useState([])

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (authAPI.isAuthenticated()) {
          const token = authAPI.getToken()
          const response = await customerAPI.getCustomers(token)
          const customerData = response.data || response // Handle both response formats
          setAllCustomers(customerData)
          setCustomers(customerData)
          
          // Extract users from customer data (all users from groups)
          const allUsersFromGroups = customerData.flatMap(group => 
            group.customers.map(customer => customer.user).filter(Boolean)
          )
          
          // Remove duplicates and create unique users array
          const uniqueUsersMap = new Map()
          allUsersFromGroups.forEach(user => {
            if (user && !uniqueUsersMap.has(user.id)) {
              uniqueUsersMap.set(user.id, {
                title: `${user.firstName} ${user.lastName}`,
                userId: user.id,
                user: user
              })
            }
          })
          
          const uniqueUsers = Array.from(uniqueUsersMap.values())
          setUsers(uniqueUsers)
        } else {
          // If not authenticated, show empty array
          setAllCustomers([])
          setCustomers([])
          setUsers([])
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
    navigate(`/customer-profile/${customerId}`)
  }

  // Handle delete customer
  const handleDeleteCustomer = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      try {
        const token = authAPI.getToken()
        await customerAPI.deleteCustomer(customerId, token)
        
        // Refresh customer list
        const response = await customerAPI.getCustomers(token)
        const customerData = response.data || response // Handle both response formats
        setAllCustomers(customerData)
        setCustomers(customerData)
        
        // Extract users again
        const allUsersFromGroups = customerData.flatMap(group => 
          group.customers.map(customer => customer.user).filter(Boolean)
        )
        
        const uniqueUsersMap = new Map()
        allUsersFromGroups.forEach(user => {
          if (user && !uniqueUsersMap.has(user.id)) {
            uniqueUsersMap.set(user.id, {
              title: `${user.firstName} ${user.lastName}`,
              userId: user.id,
              user: user
            })
          }
        })
        
        const uniqueUsers = Array.from(uniqueUsersMap.values())
        setUsers(uniqueUsers)
        
        alert('Customer deleted successfully')
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete customer: ' + error.message)
      }
    }
  }

  // Get current user ID from token
  const getCurrentUserId = () => {
    try {
      const token = authAPI.getToken()
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId
      }
    } catch (error) {
      console.error('Error getting user ID:', error)
      return null
    }
  }

  // Handle search
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase()
    setSearchTerm(searchValue)
    
    if (searchValue === '') {
      setCustomers(allCustomers)
    } else {
      const filtered = allCustomers.map(group => ({
        ...group,
        customers: group.customers.filter(customer =>
          customer.name.toLowerCase().includes(searchValue)
        )
      })).filter(group => group.customers.length > 0)
      
      setCustomers(filtered)
    }
  }

  // Handle user filter
  const handleUserFilter = (event) => {
    const userId = event.target.value
    setSelectedUser(userId)
    
    if (userId === '') {
      setCustomers(allCustomers)
    } else {
      const filtered = allCustomers.filter(group => 
        group.customers.some(customer => customer.user?.id === parseInt(userId))
      )
      setCustomers(filtered)
    }
  }

  // Combined filter (search + user filter)
  useEffect(() => {
    let filtered = allCustomers
    
    // Apply user filter first
    if (selectedUser !== '') {
      filtered = filtered.filter(group => 
        group.customers.some(customer => customer.user?.id === parseInt(selectedUser))
      )
    }
    
    // Then apply search filter
    if (searchTerm !== '') {
      filtered = filtered.map(group => ({
        ...group,
        customers: group.customers.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.customers.length > 0)
    }
    
    setCustomers(filtered)
  }, [selectedUser, searchTerm, allCustomers])

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

        {/* Search and Filter Section */}
        <Box sx={{ 
          pt: '90px', 
          px: 2,
          pb: 2,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <TextField
            fullWidth
            placeholder="Search customers by name..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          {/*}
          <FormControl fullWidth size="small">
            <InputLabel>Filter by User</InputLabel>
            <Select
              value={selectedUser}
              onChange={handleUserFilter}
              label="Filter by User"
            >
              <MenuItem value="">
                All Users
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.userId} value={user.userId}>
                  {user.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            {*/}
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          pt: 2, 
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
                        {/* Only show delete button for customers added by current user */}
                    {group?.userId === getCurrentUserId() && (
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCustomer(customer.id, customer.name)
                        }}
                        sx={{ mr: 1 }}
                        title="Delete Customer"
                      >
                        <DeleteIcon sx={{ color: 'error.main', fontSize: 20 }} />
                      </IconButton>
                    )}
  <IconButton 
                      size="small" 
                      onClick={() => navigate('/customer-notes/'+customer.id)}
                      sx={{ mr: 1 }}
                      title="View Notes"
                    >
                      <ArticleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </IconButton>
                    {/*}
                    <IconButton 
                      size="small" 
                      onClick={() => navigate('/customer-profile/'+customer.id)}
                      title="View Profile"
                    >
                      <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                    {*/}

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
