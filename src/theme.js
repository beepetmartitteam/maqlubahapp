import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f0f0f',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#6c757d',
      light: '#868e96',
      dark: '#495057',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#0f0f0f',
      secondary: '#6c757d',
    },
    divider: '#f0f0f0',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '26px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.3,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '8px 16px',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: '#f8f9fa',
          color: '#0f0f0f',
          '&:hover': {
            backgroundColor: '#e9ecef',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid #f0f0f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f8f9fa',
          '&:hover': {
            backgroundColor: '#f8f9fa',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          width: 56,
          height: 56,
        },
      },
    },
  },
})

export default theme
