import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
      default: '#f5f5f5',
      paper: '#ffffff',
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
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CompanyDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [plans, setPlans] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    setTimeout(() => {
      setCompanies([
        {
          id: 1,
          name: 'Tech Innovations Inc.',
          industry: 'Technology',
          employees: 45,
          revenue: 2500000,
          growth: 15,
          status: 'active',
          avatar: '/company1.jpg'
        },
        {
          id: 2,
          name: 'Global Solutions Ltd.',
          industry: 'Consulting',
          employees: 28,
          revenue: 1800000,
          growth: 8,
          status: 'active',
          avatar: '/company2.jpg'
        },
        {
          id: 3,
          name: 'Digital Creative Agency',
          industry: 'Design',
          employees: 12,
          revenue: 750000,
          growth: 22,
          status: 'active',
          avatar: '/company3.jpg'
        }
      ]);

      setPlans([
        {
          id: 1,
          title: 'Q4 Product Launch',
          company: 'Tech Innovations Inc.',
          status: 'in-progress',
          progress: 65,
          deadline: '2024-12-31',
          assignee: 'John Doe',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Market Expansion',
          company: 'Global Solutions Ltd.',
          status: 'pending',
          progress: 25,
          deadline: '2024-11-30',
          assignee: 'Jane Smith',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Website Redesign',
          company: 'Digital Creative Agency',
          status: 'completed',
          progress: 100,
          deadline: '2024-10-15',
          assignee: 'Mike Johnson',
          priority: 'low'
        }
      ]);

      setReports([
        {
          id: 1,
          title: 'Monthly Performance Report',
          company: 'Tech Innovations Inc.',
          type: 'performance',
          date: '2024-10-01',
          status: 'completed',
          metrics: { revenue: 250000, growth: 15, efficiency: 92 }
        },
        {
          id: 2,
          title: 'Team Productivity Analysis',
          company: 'Global Solutions Ltd.',
          type: 'productivity',
          date: '2024-10-05',
          status: 'in-progress',
          metrics: { productivity: 78, satisfaction: 85, turnover: 5 }
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const CompanyCard = ({ company }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
      onClick={() => handleCompanySelect(company)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              mr: 2,
              bgcolor: 'primary.main',
              fontSize: 24,
              fontWeight: 'bold'
            }}
          >
            {company.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company.industry}
            </Typography>
          </Box>
          <Chip 
            label={company.status} 
            color={getStatusColor(company.status)}
            size="small"
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Employees
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {company.employees}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Revenue
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ${company.revenue.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="body2" color="success.main">
            +{company.growth}% growth
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const PlanCard = ({ plan }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {plan.company}
            </Typography>
          </Box>
          <Chip 
            label={plan.priority} 
            color={getPriorityColor(plan.priority)}
            size="small"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{plan.progress}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={plan.progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200'
            }}
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{plan.deadline}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{plan.assignee}</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={plan.status} 
            color={getStatusColor(plan.status)}
            size="small"
            icon={plan.status === 'completed' ? <CheckCircleIcon /> : 
                  plan.status === 'in-progress' ? <PendingIcon /> : <ErrorIcon />}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const ReportCard = ({ report }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {report.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.company}
            </Typography>
          </Box>
          <Chip 
            label={report.type} 
            color="primary"
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">{report.date}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={report.status} 
            color={getStatusColor(report.status)}
            size="small"
          />
          <Button size="small" variant="outlined">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="sticky" sx={{ bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Toolbar>
            <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Company Management System
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen('company')}
            >
              Add Company
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Tabs */}
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                icon={<BusinessIcon />} 
                label="Companies" 
                iconPosition="start"
              />
              <Tab 
                icon={<TimelineIcon />} 
                label="Plans" 
                iconPosition="start"
              />
              <Tab 
                icon={<AssessmentIcon />} 
                label="Reports" 
                iconPosition="start"
              />
              <Tab 
                icon={<PeopleIcon />} 
                label="Teams" 
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} md={6} lg={4} key={company.id}>
                  <CompanyCard company={company} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} md={6} key={company.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {company.name} Team
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="CEO - John Doe" 
                            secondary="Chief Executive Officer" 
                          />
                          <ListItemSecondaryAction>
                            <Chip label="CEO" color="primary" size="small" />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                              <WorkIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Jane Smith" 
                            secondary="Operations Manager" 
                          />
                          <ListItemSecondaryAction>
                            <Chip label="Staff" color="default" size="small" />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <WorkIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Mike Johnson" 
                            secondary="Lead Developer" 
                          />
                          <ListItemSecondaryAction>
                            <Chip label="Staff" color="default" size="small" />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Container>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => handleDialogOpen(tabValue === 0 ? 'company' : tabValue === 1 ? 'plan' : 'report')}
        >
          <AddIcon />
        </Fab>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Add New {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select>
                <MenuItem value="">Select type</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="consulting">Consulting</MenuItem>
                <MenuItem value="design">Design</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={() => {
              showSnackbar(`${dialogType} added successfully!`);
              handleDialogClose();
            }} variant="contained">
              Add {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CompanyDashboard;
