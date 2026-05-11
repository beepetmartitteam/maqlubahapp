import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const TeamManagement = ({ companyId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    role: 'staff',
    email: '',
    phone: '',
    department: ''
  });

  useEffect(() => {
    // Mock data - replace with API call
    setTeamMembers([
      {
        id: 1,
        name: 'John Doe',
        position: 'Chief Executive Officer',
        role: 'ceo',
        email: 'john.doe@company.com',
        phone: '+1 234-567-8900',
        department: 'Executive',
        avatar: null,
        joinDate: '2020-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        position: 'Operations Manager',
        role: 'staff',
        email: 'jane.smith@company.com',
        phone: '+1 234-567-8901',
        department: 'Operations',
        avatar: null,
        joinDate: '2020-03-20'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        position: 'Lead Developer',
        role: 'staff',
        email: 'mike.johnson@company.com',
        phone: '+1 234-567-8902',
        department: 'Technology',
        avatar: null,
        joinDate: '2020-06-10'
      }
    ]);
  }, [companyId]);

  const handleDialogOpen = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        position: member.position,
        role: member.role,
        email: member.email,
        phone: member.phone,
        department: member.department
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        role: 'staff',
        email: '',
        phone: '',
        department: ''
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      role: 'staff',
      email: '',
      phone: '',
      department: ''
    });
  };

  const handleSave = () => {
    if (editingMember) {
      // Update existing member
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...formData }
            : member
        )
      );
    } else {
      // Add new member
      const newMember = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setTeamMembers(prev => [...prev, newMember]);
    }
    handleDialogClose();
  };

  const handleDelete = (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ceo': return 'error';
      case 'manager': return 'warning';
      case 'staff': return 'primary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ceo': return 'CEO';
      case 'manager': return 'Manager';
      case 'staff': return 'Staff';
      default: return role;
    }
  };

  const TeamMemberCard = ({ member }) => (
    <Card sx={{ mb: 2, transition: 'all 0.3s ease' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mr: 2,
              bgcolor: member.role === 'ceo' ? 'error.main' : 'primary.main',
              fontSize: 24,
              fontWeight: 'bold'
            }}
          >
            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {member.position}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={getRoleLabel(member.role)} 
                color={getRoleColor(member.role)}
                size="small"
              />
              <Chip 
                label={member.department} 
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => handleDialogOpen(member)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(member.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{member.email}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{member.phone}</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="text.secondary">
            Joined: {new Date(member.joinDate).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Team Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
        >
          Add Team Member
        </Button>
      </Box>

      {/* Team Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
              {teamMembers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Members
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
              {teamMembers.filter(m => m.role === 'ceo').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CEOs
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
              {teamMembers.filter(m => m.role === 'manager').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Managers
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
              {teamMembers.filter(m => m.role === 'staff').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Staff Members
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Team Members List */}
      <Grid container spacing={3}>
        {teamMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id}>
            <TeamMemberCard member={member} />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="ceo">CEO</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingMember ? 'Update' : 'Add'} Team Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;
