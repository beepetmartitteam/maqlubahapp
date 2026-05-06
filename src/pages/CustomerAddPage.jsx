import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { customerAPI } from '../api/customer'
import { authAPI } from '../api/auth'
import { uploadToCloudinary } from '../utils/cloudinary'

const CustomerAddPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    umur :'',
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

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
        location: formData.location  || '-',
        age: formData.umur  || '-',
        address: formData.address || '-',
        phone: formData.phone || "-",
        email: formData.email || "-",
        kerjaya: formData.kerjaya || '-',
        kerjasama: formData.kerjasama || '-',
        kehidupanKeluarga: formData.kehidupankeluarga || '-',
        notes: formData.notes || '-'
      }

      // Create customer via API
      // Use Cloudinary URL if available, otherwise use file for local upload
      const images = imagePreview ? [imagePreview] : []
      const result = await customerAPI.createCustomer(token, customerData, images)
      console.log('Customer created successfully:', result)

      // Navigate back to customer list
      navigate('/customer')
      
    } catch (err) {
      console.error('Failed to create customer:', err)
      setError(err.message || 'Failed to create customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: 'background.default',
        minHeight: '100vh',
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
                  ADD CUSTOMER
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
                  <AddIcon />
                )}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                {uploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600 }}>
                      Uploading...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      Waiting
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                      Add Picture
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      Press to add picture
                    </Typography>
                  </>
                )}
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
                required
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
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
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
                label="No. HP"
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
                label="Family"
                value={formData.kehidupankeluarga}
                onChange={handleInputChange('kehidupankeluarga')}
                variant="outlined"
                size="small"
                    multiline
                rows={4}
            
              />
              <TextField
                fullWidth
                label="Note"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />
            </Box>

            {/* Error Display */}
            {error && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'error.light', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'error.main',
                mt: 2
              }}>
                <Typography variant="body2" color="error.dark">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
             
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Saving...' : 'SAVE'}
              </Button>
               <Button 
                variant="outlined" 
                fullWidth
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/customer')}
                sx={{ py: 1.5 }}
              >
                CANCEL
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

export default CustomerAddPage
