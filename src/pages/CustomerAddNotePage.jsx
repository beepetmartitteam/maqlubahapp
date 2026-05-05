import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
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
  Cancel as CancelIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { notesAPI } from '../api/notes'
import { authAPI } from '../api/auth'
import { uploadMultipleToCloudinary } from '../utils/cloudinary'

const CustomerAddNotePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)
  
  // Form state
  const [noteForm, setNoteForm] = useState({
    note: '',
    images: []
  })
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }))
    
    setNoteForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (imageId) => {
    setNoteForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const handleInputChange = (field) => (event) => {
    setNoteForm(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async () => {
    if (!noteForm.caption && !noteForm.note && noteForm.images.length === 0) {
      return
    }

    try {
      setLoading(true)
      setUploading(true)
      setError(null)

      // Get authentication token
      const token = authAPI.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Upload images to Cloudinary first
      let uploadedImages = []
      if (noteForm.images.length > 0) {
        const imageFiles = noteForm.images
          .filter(imageObj => imageObj.file)
          .map(imageObj => imageObj.file)
        
        if (imageFiles.length > 0) {
          uploadedImages = await uploadMultipleToCloudinary(imageFiles)
          uploadedImages = uploadedImages.map(img => img.url)
        }
      }

      // Prepare note data
      const noteData = {
        caption: noteForm.caption || '-',
        note: noteForm.note || '',
        images: uploadedImages
      }

      // Create note via API
      const result = await notesAPI.createCustomerNote(id, noteData, token)
      console.log('Note created successfully:', result)

      // Navigate back to notes page
      navigate(`/customer-notes/${id}`)
      
    } catch (err) {
      console.error('Failed to create note:', err)
      setError(err.message || 'Failed to create note')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
          }
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => navigate('/customer-notes')}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h1" sx={{ fontSize: '20px', fontWeight: 600, bgcolor: 'background.paper', color: 'text.primary'}}>
                  Add Note
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Form Content */}
        <Box sx={{ 
          pt: '76px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%',
          px: 0
        }}>
          <Paper sx={{ 
            p: 2, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            mb: 2
          }}>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            {/* Image Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
                Picture
              </Typography>
              
              {/* Image Preview */}
              {noteForm.images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {noteForm.images.map((image) => (
                      <Box key={image.id} sx={{ position: 'relative' }}>
                        <img
                          src={image.preview}
                          alt="Preview"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(image.id)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'background.default',
                            '&:hover': { backgroundColor: 'background.paper' }
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Add Image Button */}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={triggerFileInput}
                sx={{ mb: 2 }}
              >
                Add Pictures
              </Button>
            </Box>
            {/* Note Field */}
            <TextField
              fullWidth
              label="Title"
              value={noteForm.caption}
              onChange={handleInputChange('caption')}
              variant="outlined"
              size="small"
              multiline
              rows={2}
              placeholder="Title "
              sx={{ mb: 3 }}
            />



            {/* Note Field */}
            <TextField
              fullWidth
              label="Note"
              value={noteForm.note}
              onChange={handleInputChange('note')}
              variant="outlined"
              size="small"
              multiline
              rows={6}
              placeholder="Write note"
              sx={{ mb: 3 }}
            />

            {/* Error Display */}
            {error && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'error.light', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'error.main'
              }}>
                <Typography variant="body2" color="error.dark">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             
              <Button 
                variant="contained" 
                fullWidth
                startIcon={loading || uploading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={loading || uploading || (!noteForm.caption && !noteForm.note && noteForm.images.length === 0)}
                sx={{ py: 1.5 }}
              >
                {uploading ? 'UPLOADING...' : loading ? 'PROCESSING...' : 'SAVE'}
              </Button>
               <Button 
                variant="outlined" 
                fullWidth
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/customer-notes/${id}`)}
                sx={{ py: 1.5 }}
                disabled={loading}
              >
                BATAL
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

export default CustomerAddNotePage
