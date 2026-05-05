import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
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
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Add as AddIcon,
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { customerAPI } from '../api/customer'
import { authAPI } from '../api/auth'
import { uploadToCloudinary } from '../utils/cloudinary'

const CustomerEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)
  
  // States
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  // Initialize form with existing customer data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    umur: '',
    address: '',
    phone: '',
    email: '',
    kerjaya: '',
    kerjasama: '',
    kehidupankeluarga: '',
    notes: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = authAPI.getToken()
        if (!token) {
          throw new Error('No authentication token found')
        }

        const customerData = await customerAPI.getCustomerById(id, token)
        setCustomer(customerData)
        
        // Populate form with customer data
        setFormData({
          name: customerData.name || '',
          location: customerData.location || '',
          umur: customerData.age || '',
          address: customerData.address || '',
          phone: customerData.phone || '',
          email: customerData.email || '',
          kerjaya: customerData.kerjaya || '',
          kerjasama: customerData.kerjasama || '',
          kehidupankeluarga: customerData.kehidupanKeluarga || '',
          notes: customerData.notes || ''
        })
        
        // Set existing avatar if any
        if (customerData.avatarUrl) {
          setImagePreview(customerData.avatarUrl)
        }
        
      } catch (err) {
        console.error('Failed to fetch customer data:', err)
        setError(err.message || 'Failed to fetch customer data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomerData()
    }
  }, [id])

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        setUploading(true)
        setError(null)

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file)
        
        // Store the Cloudinary URL and file for API
        setProfileImage(file)
        setImagePreview(result.url)
        
        console.log('Image uploaded to Cloudinary:', result)
      } catch (err) {
        console.error('Failed to upload image:', err)
        setError('Failed to upload image: ' + err.message)
      } finally {
        setUploading(false)
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      setError('Name is required')
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      // Get authentication token
      const token = authAPI.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Prepare form data for API
      const customerData = {
        name: formData.name,
        location: formData.location || '-',
        age: formData.umur || '-',
        address: formData.address || '-',
        phone: formData.phone,
        email: formData.email,
        kerjaya: formData.kerjaya || '-',
        kerjasama: formData.kerjasama || '-',
        kehidupanKeluarga: formData.kehidupankeluarga || '-',
        notes: formData.notes || '-'
      }

      // Use Cloudinary URL if available, otherwise keep existing
      const images = imagePreview ? [imagePreview] : (customer?.avatarUrl ? [customer.avatarUrl] : [])
      
      // Update customer via API
      const result = await customerAPI.updateCustomer(id, customerData, token, images)
      console.log('Customer updated successfully:', result)

      // Navigate back to customer profile
      navigate(`/customer-profile/${id}`)
      
    } catch (err) {
      console.error('Failed to update customer:', err)
      setError(err.message || 'Failed to update customer')
    } finally {
      setLoading(false)
    }
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
          height: '76px',
          minHeight: '76px',
          zIndex: 1099,
          '& .MuiToolbar-root': {
            minHeight: '76px',
            height: '76px',
          }
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate('/customer')}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h1" sx={{ fontSize: '20px', fontWeight: 600, bgcolor: 'background.paper', color: 'text.primary'}}>
                  EDIT CUSTOMER
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Form Content */}
        <Box sx={{ 
          pt: '50px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%',
          px: 0
        }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2,
            mb: 2,
            borderSize: 1
          }}>
            {/* Profile Picture Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Avatar 
                src={imagePreview}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  bgcolor: 'background.default',
                  border: '2px dashed',
                  borderColor: 'divider',
                  cursor: 'pointer'
                }}
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <img 
                    src={imagePreview}
                    alt="Current profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                )}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                  Edit Gambar Profil
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                  Press to change picture
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Age"
                value={formData.umur}
                onChange={handleInputChange('umur')}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                variant="outlined"
                size="small"
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="No. Telefon"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Kerjaya"
                value={formData.kerjaya}
                onChange={handleInputChange('kerjaya')}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />

              <TextField
                fullWidth
                label="Kerjasama"
                value={formData.kerjasama}
                onChange={handleInputChange('kerjasama')}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />

              <TextField
                fullWidth
                label="Kehidupan Keluarga"
                value={formData.kehidupankeluarga}
                onChange={handleInputChange('kehidupankeluarga')}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />

              <TextField
                fullWidth
                label="Catatan"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
               <Button 
                variant="contained" 
                fullWidth
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{ py: 1.5 }}
              >
                SAVE
              </Button>
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

export default CustomerEditPage
