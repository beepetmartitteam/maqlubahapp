import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Button,
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
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { notesAPI } from '../api/notes'
import { authAPI } from '../api/auth'

const CustomerNotesPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Handle delete note
  const handleDeleteNote = async (noteId) => {
    try {
      const token = authAPI.getToken()
      if (!token) return

      await notesAPI.deleteNote(noteId, token)
      
      // Refresh notes list
      const notesData = await notesAPI.getCustomerNotes(id, token)
      setNotes(notesData)
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  // Fetch customer notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = authAPI.getToken()
        console.log('Token exists:', !!token)
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null')
        console.log('Is authenticated:', authAPI.isAuthenticated())
        
        if (!token) {
          navigate('/login')
          return
        }

        // Get current user info
        const user = authAPI.getCurrentUser()
        setCurrentUser(user)
        
        const notesData = await notesAPI.getCustomerNotes(id, token)
        setNotes(notesData)
        
      } catch (err) {
        console.error('Failed to fetch notes:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNotes()
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
              <IconButton size="small" onClick={() => navigate('/customer-profile/'+id)}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h1" sx={{ fontSize: '20px', fontWeight: 600, bgcolor: 'background.paper', color: 'text.primary'}}>
                  NOTES
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Chat Messages */}
        <Box sx={{ 
          pt: '76px', 
          pb: '240px',
          height: '100vh',
          overflowY: 'auto',
          width: '100%',
          px: 2
        }}>
          {/* Customer Notes */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {notes && notes.length > 0 ? notes.map((note) => (
              <Box key={note.id} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ maxWidth: '100%' }}>
                  {note.images && note.images.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      {note.images.length === 1 ? (
                        // Single image
                        <img 
                          src={note.images[0].startsWith('http') ? note.images[0] : `http://localhost:5000${note.images[0]}`} 
                          alt={note.caption || 'Note image'} 
                          style={{ 
                            width: '100%', 
                            height: '120px', 
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }} 
                        />
                      ) : (
                        // Multiple images - display as grid
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: note.images.length === 2 ? '1fr 1fr' : 'repeat(2, 1fr)',
                          gap: 1,
                          mb: 1
                        }}>
                          {note.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image.startsWith('http') ? image : `http://localhost:5000${image}`} 
                              alt={`${note.caption || 'Note image'} ${index + 1}`} 
                              style={{ 
                                width: '100%', 
                                height: note.images.length === 2 ? '120px' : '80px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }} 
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                  <Paper sx={{ 
                    p: 2, 
                    backgroundColor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}>
                    {note.caption && (
                      <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                        {note.caption}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: 1.4 }}>
                      {note.note}
                    </Typography>
                  </Paper>
                  
{/* User Info */}
{note.user && (
<Box sx={{ 
display: 'flex', 
alignItems: 'center', 
justifyContent: 'space-between',
gap: 1,
mt: 1,
mb: 0.5
}}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<Avatar sx={{ width: 24, height: 24, fontSize: '12px' }}>
{note.user.firstName ? note.user.firstName.charAt(0).toUpperCase() : 'U'}
</Avatar>
<Typography variant="caption" sx={{ 
fontSize: '12px', 
color: 'text.secondary',
fontWeight: 500
}}>
{note.user.firstName && note.user.lastName 
? `${note.user.firstName} ${note.user.lastName}`
: note.user.firstName || note.user.email || 'Unknown User'
}
</Typography>
</Box>
                      
{/* Delete button for note owner */}
{currentUser && note.userId === currentUser.id && (
<IconButton 
size="small" 
onClick={() => handleDeleteNote(note.id)}
sx={{ 
p: 0.5,
'&:hover': { backgroundColor: 'error.light' }
}}
>
<DeleteIcon sx={{ fontSize: '16px', color: 'error.main' }} />
</IconButton>
)}
</Box>
)}

<Typography variant="caption" sx={{ 
fontSize: '12px', 
color: 'text.secondary',
display: 'block'
}}>
{new Date(note.created_at).toLocaleDateString('id-ID', {
day: 'numeric',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
})}
</Typography>
</Box>
</Box>
)) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No notes yet for this customer
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Floating Action Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/customer-add-note/'+id)}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            borderRadius: '50%',
            width: 56,
            height: 56,
            minWidth: 0,
            zIndex: 1097
          }}
        >
        </Button>

       
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

export default CustomerNotesPage
