import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
// Note: DatePicker moved to @mui/x-date-pickers in v5
// Using TextField with type="date" as fallback for now
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Timeline as TimelineIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const PlanningManagement = ({ companyId }) => {
  const [plans, setPlans] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'planning',
    assignee: '',
    deadline: '',
    budget: '',
    category: 'development'
  });

  useEffect(() => {
    // Mock data - replace with API call
    setPlans([
      {
        id: 1,
        title: 'Q4 Product Launch',
        description: 'Launch new product line for Q4 with comprehensive marketing campaign',
        priority: 'high',
        status: 'in-progress',
        progress: 65,
        assignee: 'John Doe',
        deadline: '2024-12-31',
        budget: 50000,
        category: 'product',
        createdAt: '2024-10-01',
        updatedAt: '2024-10-15',
        milestones: [
          { id: 1, title: 'Market Research', completed: true, date: '2024-10-05' },
          { id: 2, title: 'Product Development', completed: true, date: '2024-10-20' },
          { id: 3, title: 'Marketing Campaign', completed: false, date: '2024-11-15' },
          { id: 4, title: 'Launch Event', completed: false, date: '2024-12-31' }
        ]
      },
      {
        id: 2,
        title: 'Market Expansion Strategy',
        description: 'Expand business operations to Southeast Asian markets',
        priority: 'medium',
        status: 'planning',
        progress: 25,
        assignee: 'Jane Smith',
        deadline: '2024-11-30',
        budget: 75000,
        category: 'business',
        createdAt: '2024-10-05',
        updatedAt: '2024-10-10',
        milestones: [
          { id: 1, title: 'Market Analysis', completed: true, date: '2024-10-10' },
          { id: 2, title: 'Legal Setup', completed: false, date: '2024-11-01' },
          { id: 3, title: 'Office Launch', completed: false, date: '2024-11-30' }
        ]
      },
      {
        id: 3,
        title: 'Digital Transformation',
        description: 'Complete digital transformation of all business processes',
        priority: 'high',
        status: 'completed',
        progress: 100,
        assignee: 'Mike Johnson',
        deadline: '2024-10-15',
        budget: 100000,
        category: 'technology',
        createdAt: '2024-09-01',
        updatedAt: '2024-10-15',
        milestones: [
          { id: 1, title: 'System Assessment', completed: true, date: '2024-09-15' },
          { id: 2, title: 'Software Implementation', completed: true, date: '2024-10-01' },
          { id: 3, title: 'Staff Training', completed: true, date: '2024-10-15' }
        ]
      }
    ]);
  }, [companyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogOpen = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        title: plan.title,
        description: plan.description,
        priority: plan.priority,
        status: plan.status,
        assignee: plan.assignee,
        deadline: plan.deadline,
        budget: plan.budget,
        category: plan.category
      });
    } else {
      setEditingPlan(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'planning',
        assignee: '',
        deadline: '',
        budget: '',
        category: 'development'
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSave = () => {
    if (editingPlan) {
      setPlans(prev => 
        prev.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : plan
        )
      );
    } else {
      const newPlan = {
        id: Date.now(),
        ...formData,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        milestones: []
      };
      setPlans(prev => [...prev, newPlan]);
    }
    handleDialogClose();
  };

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(prev => prev.filter(plan => plan.id !== selectedPlan.id));
      handleMenuClose();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planning': return 'info';
      case 'delayed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in-progress': return <ScheduleIcon />;
      case 'planning': return <CalendarIcon />;
      case 'delayed': return <WarningIcon />;
      default: return <CalendarIcon />;
    }
  };

  const PlanCard = ({ plan }) => (
    <Card sx={{ mb: 3, transition: 'all 0.3s ease' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {plan.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={plan.priority} 
                color={getPriorityColor(plan.priority)}
                size="small"
                icon={<FlagIcon />}
              />
              <Chip 
                label={plan.category} 
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
          <IconButton onClick={(e) => handleMenuOpen(e, plan)}>
            <MoreVertIcon />
          </IconButton>
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
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{plan.assignee}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{plan.deadline}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">${plan.budget.toLocaleString()}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip 
              label={plan.status} 
              color={getStatusColor(plan.status)}
              size="small"
              icon={getStatusIcon(plan.status)}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const MilestoneTimeline = ({ milestones }) => (
    <Timeline>
      {milestones.map((milestone, index) => (
        <TimelineItem key={milestone.id}>
          <TimelineOppositeContent sx={{ m: 'auto 0' }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(milestone.date).toLocaleDateString()}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot 
              color={milestone.completed ? 'success' : 'grey'}
              variant={milestone.completed ? 'filled' : 'outlined'}
            />
            {index < milestones.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {milestone.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {milestone.completed ? 'Completed' : 'Pending'}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Planning Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
        >
          Create New Plan
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
              {plans.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Plans
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
              {plans.filter(p => p.status === 'completed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
              {plans.filter(p => p.status === 'in-progress').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
              {plans.filter(p => p.priority === 'high').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Priority
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Plans Overview" />
          <Tab label="Timeline View" />
          <Tab label="Kanban Board" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {plans.map((plan) => (
            <Card key={plan.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {plan.title}
                </Typography>
                <MilestoneTimeline milestones={plan.milestones} />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {tabValue === 2 && (
        <Grid container spacing={2}>
          {['planning', 'in-progress', 'completed'].map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                  {status.replace('-', ' ')}
                </Typography>
                {plans
                  .filter(plan => plan.status === status)
                  .map((plan) => (
                    <Card key={plan.id} sx={{ mb: 2, cursor: 'pointer' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {plan.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plan.assignee} • {plan.deadline}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleDialogOpen(selectedPlan); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Plan' : 'Create New Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingPlan ? 'Update' : 'Create'} Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanningManagement;
