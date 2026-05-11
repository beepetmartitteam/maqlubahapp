import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineChartIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const ReportingDashboard = ({ companyId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Mock data - replace with API calls
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: 'Monthly Performance Report',
          type: 'performance',
          date: '2024-10-01',
          status: 'completed',
          company: 'Tech Innovations Inc.',
          metrics: {
            revenue: 250000,
            growth: 15,
            efficiency: 92,
            satisfaction: 88,
            productivity: 78
          }
        },
        {
          id: 2,
          title: 'Team Productivity Analysis',
          type: 'productivity',
          date: '2024-10-05',
          status: 'completed',
          company: 'Tech Innovations Inc.',
          metrics: {
            productivity: 78,
            satisfaction: 85,
            turnover: 5,
            engagement: 92,
            performance: 81
          }
        },
        {
          id: 3,
          title: 'Financial Summary Q3',
          type: 'financial',
          date: '2024-09-30',
          status: 'completed',
          company: 'Tech Innovations Inc.',
          metrics: {
            revenue: 750000,
            expenses: 450000,
            profit: 300000,
            margin: 40,
            growth: 12
          }
        },
        {
          id: 4,
          title: 'Project Completion Report',
          type: 'project',
          date: '2024-10-10',
          status: 'in-progress',
          company: 'Tech Innovations Inc.',
          metrics: {
            completed: 8,
            inProgress: 3,
            delayed: 1,
            onTime: 85,
            budget: 92
          }
        }
      ]);

      setMetrics({
        totalRevenue: 1250000,
        revenueGrowth: 15.2,
        totalEmployees: 45,
        employeeGrowth: 8.5,
        completedProjects: 12,
        customerSatisfaction: 87.5,
        efficiency: 89.2,
        productivity: 82.1
      });

      setLoading(false);
    }, 1000);
  }, [companyId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReport(null);
  };

  const handleExportReport = (reportId) => {
    // Mock export functionality
    console.log('Exporting report:', reportId);
    alert('Report exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const MetricCard = ({ title, value, icon, color, trend, unit = '' }) => (
    <Card sx={{ height: '100%', transition: 'all 0.3s ease' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 1, 
              bgcolor: `${color}.main`, 
              color: 'white',
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value.toLocaleString()}{unit}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {trend > 0 ? (
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography 
                  variant="body2" 
                  color={trend > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const ReportCard = ({ report }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
      onClick={() => handleReportClick(report)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {report.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.company}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={report.type} 
              color="primary"
              size="small"
            />
            <Chip 
              label={report.status} 
              color={getStatusColor(report.status)}
              size="small"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{report.date}</Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              handleExportReport(report.id);
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const PerformanceChart = () => (
    <Card sx={{ height: 400, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Performance Overview
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Alert severity="info">
            Chart visualization would be implemented here with Chart.js or Recharts
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );

  const ReportsTable = () => (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Report Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} hover>
              <TableCell>{report.title}</TableCell>
              <TableCell>
                <Chip label={report.type} color="primary" size="small" />
              </TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>
                <Chip label={report.status} color={getStatusColor(report.status)} size="small" />
              </TableCell>
              <TableCell>{report.company}</TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  onClick={() => handleReportClick(report)}
                  sx={{ mr: 1 }}
                >
                  <AssessmentIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleExportReport(report.id)}
                >
                  <FileDownloadIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Reporting Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="quarter">Quarter</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export All
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            icon={<AttachMoneyIcon />}
            color="primary"
            trend={metrics.revenueGrowth}
            unit="$"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Employees"
            value={metrics.totalEmployees}
            icon={<PeopleIcon />}
            color="secondary"
            trend={metrics.employeeGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed Projects"
            value={metrics.completedProjects}
            icon={<AssessmentIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Customer Satisfaction"
            value={metrics.customerSatisfaction}
            icon={<TrendingUpIcon />}
            color="warning"
            unit="%"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<BarChartIcon />} label="Overview" />
          <Tab icon={<PieChartIcon />} label="Analytics" />
          <Tab icon={<TimelineChartIcon />} label="Reports" />
          <Tab icon={<AssessmentIcon />} label="Export" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          <PerformanceChart />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Reports
                </Typography>
                {reports.slice(0, 3).map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Efficiency Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.efficiency}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Productivity</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.productivity}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Avg Growth</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      +{metrics.revenueGrowth}%
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <PerformanceChart />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 300, p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Revenue Breakdown
                </Typography>
                <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Alert severity="info">
                    Pie chart would be implemented here
                  </Alert>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 300, p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Growth Trends
                </Typography>
                <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Alert severity="info">
                    Line chart would be implemented here
                  </Alert>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <ReportsTable />
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Export Options
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="outlined" startIcon={<FileDownloadIcon />} fullWidth>
                    Export as PDF
                  </Button>
                  <Button variant="outlined" startIcon={<FileDownloadIcon />} fullWidth>
                    Export as Excel
                  </Button>
                  <Button variant="outlined" startIcon={<FileDownloadIcon />} fullWidth>
                    Export as CSV
                  </Button>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Scheduled Reports
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info">
                    Configure automated report generation and delivery
                  </Alert>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Report Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedReport?.title}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Report Type"
                    value={selectedReport.type}
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedReport.status}
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={`${selectedReport.title} - Generated on ${selectedReport.date}`}
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Key Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(selectedReport.metrics).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField
                          fullWidth
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          value={typeof value === 'number' ? value.toLocaleString() : value}
                          margin="normal"
                          disabled
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          <Button 
            onClick={() => handleExportReport(selectedReport?.id)} 
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Export Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportingDashboard;
