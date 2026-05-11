import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

import CompanyDashboard from './components/CompanyDashboard';
import TeamManagement from './components/TeamManagement';
import PlanningManagement from './components/PlanningManagement';
import ReportingDashboard from './components/ReportingDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2c3e50',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

const drawerWidth = 280;

const CompanyApp = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Mock user data - replace with authentication
    setUser({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      avatar: null
    });

    // Mock selected company
    setSelectedCompany({
      id: 1,
      name: 'Tech Innovations Inc.',
      industry: 'Technology',
      employees: 45,
      revenue: 2500000,
      growth: 15,
      status: 'active'
    });
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    // Implement logout logic
    console.log('Logging out...');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      badge: null
    },
    {
      text: 'Companies',
      icon: <BusinessIcon />,
      path: '/companies',
      badge: null
    },
    {
      text: 'Team',
      icon: <PeopleIcon />,
      path: '/team',
      badge: null
    },
    {
      text: 'Planning',
      icon: <TimelineIcon />,
      path: '/planning',
      badge: notifications
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports',
      badge: null
    },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          CompanyHub
        </Typography>
        {selectedCompany && (
          <Typography variant="body2" color="text.secondary">
            {selectedCompany.name}
          </Typography>
        )}
      </Box>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component="a"
            href={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 1 }}>
        <ListItem
          component="a"
          href="/settings"
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{
              fontWeight: 500,
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  if (!user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* Header */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            zIndex: 1200,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <BusinessIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedCompany?.name || 'Company Management'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={notifications} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Profile">
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                  >
                    <Avatar 
                      sx={{ width: 32, height: 32 }}
                      src={user.avatar}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  onClick={handleProfileMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileMenuClose}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <Box
            component="nav"
            sx={{ width: drawerWidth, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  borderRight: 'none',
                  boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  borderRight: 'none',
                  boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              mt: '64px',
              backgroundColor: 'background.default',
              minHeight: '100vh'
            }}
          >
            <Routes>
              <Route path="/" element={<CompanyDashboard />} />
              <Route path="/companies" element={<CompanyDashboard />} />
              <Route path="/team" element={<TeamManagement companyId={selectedCompany?.id} />} />
              <Route path="/planning" element={<PlanningManagement companyId={selectedCompany?.id} />} />
              <Route path="/reports" element={<ReportingDashboard companyId={selectedCompany?.id} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
  );
};

export default CompanyApp;
