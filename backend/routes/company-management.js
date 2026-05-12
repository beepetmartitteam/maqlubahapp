const express = require('express');
const router = express.Router();
const { Company, Staff, Plan, Report, Task, sequelize } = require('../models');

// Health check for company management (move to top to avoid conflicts)
router.get('/health', async (req, res) => {
  try {
    const companyCount = await Company.count();
    const staffCount = await Staff.count();
    const planCount = await Plan.count();
    const reportCount = await Report.count();
    
    res.json({ 
      success: true,
      message: 'Company Management API is healthy',
      data: {
        companies: companyCount,
        staff: staffCount,
        plans: planCount,
        reports: reportCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'name', 'position', 'email', 'status']
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['id', 'title', 'status', 'deadline', 'priority']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Dashboard endpoint
router.get('/dashboard', async (req, res) => {
  try {
    // Simple approach - get companies without complex includes first
    const companies = await Company.findAll({
      order: [['updated_at', 'DESC']]
    });

    // Get staff and plans counts separately
    const staffCounts = await Staff.findAll({
      attributes: [
        'company_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['company_id']
    });

    const planCounts = await Plan.findAll({
      attributes: [
        'company_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['company_id']
    });

    // Calculate dashboard statistics
    let totalStaff = 0;
    let totalPlans = 0;
    let totalRevenue = 0;
    let totalGrowth = 0;
    let activeCompanies = 0;
    const plansByStatus = { planning: 0, 'in-progress': 0, completed: 0, cancelled: 0, 'on-hold': 0 };
    const companiesByIndustry = {};

    companies.forEach(company => {
      // Basic stats
      totalRevenue += parseFloat(company.revenue || 0);
      totalGrowth += parseFloat(company.growth || 0);
      
      if (company.status === 'active') {
        activeCompanies++;
      }

      // Industry breakdown
      const industry = company.industry || 'Other';
      companiesByIndustry[industry] = (companiesByIndustry[industry] || 0) + 1;
    });

    // Count staff and plans
    staffCounts.forEach(staffCount => {
      totalStaff += parseInt(staffCount.dataValues.count);
    });

    planCounts.forEach(planCount => {
      totalPlans += parseInt(planCount.dataValues.count);
    });

    // Get plan status breakdown
    const planStatuses = await Plan.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    planStatuses.forEach(status => {
      plansByStatus[status.dataValues.status] = parseInt(status.dataValues.count);
    });

    // Get recent activity (simplified)
    const recentPlans = await Plan.findAll({
      include: [{
        model: Company,
        as: 'company',
        attributes: ['name', 'color']
      }],
      order: [['updated_at', 'DESC']],
      limit: 5
    });

    const recentActivity = recentPlans.map(plan => ({
      type: 'plan',
      company: plan.company.name,
      title: plan.title,
      status: plan.status,
      date: plan.updated_at,
      color: plan.company.color
    }));

    const dashboardData = {
      overview: {
        totalCompanies: companies.length,
        totalStaff,
        totalPlans,
        totalRevenue,
        averageGrowth: companies.length > 0 ? (totalGrowth / companies.length).toFixed(2) : 0,
        activeCompanies
      },
      charts: {
        plansByStatus,
        companiesByIndustry
      },
      recentActivity,
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        employees: company.employees,
        revenue: company.revenue,
        growth: company.growth,
        status: company.status,
        color: company.color,
        ceo: company.ceo,
        staffCount: staffCounts.find(s => s.company_id === company.id)?.dataValues.count || 0,
        plansCount: planCounts.find(p => p.company_id === company.id)?.dataValues.count || 0,
        updated_at: company.updated_at
      }))
    };

    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'name', 'position', 'email', 'phone', 'department', 'status']
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['id', 'title', 'status', 'deadline', 'priority']
        }
      ]
    });

    
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Company not found' 
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const {
      name,
      industry,
      employees = 0,
      revenue = 0,
      growth = 0,
      status = 'active',
      color = '#1976d2',
      ceo,
      description,
      website,
      email,
      phone,
      address,
      foundedDate,
      registrationNumber
    } = req.body;

    // Validation
    if (!name || !industry || !ceo) {
      return res.status(400).json({
        success: false,
        error: 'Name, industry, and CEO are required'
      });
    }

    const company = await Company.create({
      name: name.trim(),
      industry: industry.trim(),
      employees: parseInt(employees),
      revenue: parseFloat(revenue),
      growth: parseFloat(growth),
      status,
      color: color.trim(),
      ceo: ceo.trim(),
      description,
      website,
      email,
      phone,
      address,
      foundedDate,
      registrationNumber
    });

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully'
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      industry,
      employees,
      revenue,
      growth,
      status,
      color,
      ceo,
      description,
      website,
      email,
      phone,
      address,
      foundedDate,
      registrationNumber
    } = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Company not found' 
      });
    }

    await company.update({
      name: name?.trim() || company.name,
      industry: industry?.trim() || company.industry,
      employees: employees !== undefined ? parseInt(employees) : company.employees,
      revenue: revenue !== undefined ? parseFloat(revenue) : company.revenue,
      growth: growth !== undefined ? parseFloat(growth) : company.growth,
      status: status || company.status,
      color: color?.trim() || company.color,
      ceo: ceo?.trim() || company.ceo,
      description,
      website,
      email,
      phone,
      address,
      foundedDate,
      registrationNumber
    });

    res.json({
      success: true,
      data: company,
      message: 'Company updated successfully'
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Company not found' 
      });
    }

    await company.destroy();

    res.json({
      success: true,
      message: 'Company deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Staff Management Routes

// Get all staff for a company
router.get('/:id/staff', async (req, res) => {
  try {
    const { id } = req.params;
    
    const staff = await Staff.findAll({
      where: { companyId: id },
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: staff,
      count: staff.length
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add staff to company
router.post('/:id/staff', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      position,
      email,
      phone,
      department,
      hireDate,
      salary,
      status = 'active'
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Staff name is required'
      });
    }

    const staff = await Staff.create({
      companyId: id,
      name: name.trim(),
      position,
      email,
      phone,
      department,
      hireDate,
      salary: salary ? parseFloat(salary) : null,
      status
    });

    res.status(201).json({
      success: true,
      data: staff,
      message: 'Staff added successfully'
    });
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update staff
router.put('/:companyId/staff/:staffId', async (req, res) => {
  try {
    const { companyId, staffId } = req.params;
    const {
      name,
      position,
      email,
      phone,
      department,
      hireDate,
      salary,
      status
    } = req.body;

    const staff = await Staff.findOne({
      where: { id: staffId, companyId }
    });

    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        error: 'Staff not found' 
      });
    }

    await staff.update({
      name: name?.trim() || staff.name,
      position,
      email,
      phone,
      department,
      hireDate,
      salary: salary !== undefined ? parseFloat(salary) : staff.salary,
      status
    });

    res.json({
      success: true,
      data: staff,
      message: 'Staff updated successfully'
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete staff
router.delete('/:companyId/staff/:staffId', async (req, res) => {
  try {
    const { companyId, staffId } = req.params;
    
    const staff = await Staff.findOne({
      where: { id: staffId, companyId }
    });

    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        error: 'Staff not found' 
      });
    }

    await staff.destroy();

    res.json({
      success: true,
      message: 'Staff deleted successfully',
      data: { staffId }
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Plan Management Routes

// Get all plans for a company
router.get('/:id/plans', async (req, res) => {
  try {
    const { id } = req.params;
    
    const plans = await Plan.findAll({
      where: { companyId: id },
      include: [
        {
          model: Staff,
          as: 'assignedStaff',
          attributes: ['id', 'name', 'position']
        }
      ],
      order: [['deadline', 'ASC']]
    });

    res.json({
      success: true,
      data: plans,
      count: plans.length
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add plan to company
router.post('/:id/plans', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status = 'planning',
      priority = 'medium',
      deadline,
      startDate,
      endDate,
      budget,
      assignedTo,
      tags,
      notes
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Plan title is required'
      });
    }

    const plan = await Plan.create({
      companyId: id,
      title: title.trim(),
      description,
      status,
      priority,
      deadline,
      startDate,
      endDate,
      budget: budget ? parseFloat(budget) : null,
      assignedTo,
      tags,
      notes
    });

    res.status(201).json({
      success: true,
      data: plan,
      message: 'Plan created successfully'
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update plan
router.put('/:companyId/plans/:planId', async (req, res) => {
  try {
    const { companyId, planId } = req.params;
    const {
      title,
      description,
      status,
      priority,
      deadline,
      startDate,
      endDate,
      budget,
      actualCost,
      progress,
      assignedTo,
      tags,
      notes
    } = req.body;

    const plan = await Plan.findOne({
      where: { id: planId, companyId }
    });

    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plan not found' 
      });
    }

    await plan.update({
      title: title?.trim() || plan.title,
      description,
      status,
      priority,
      deadline,
      startDate,
      endDate,
      budget: budget !== undefined ? parseFloat(budget) : plan.budget,
      actualCost: actualCost !== undefined ? parseFloat(actualCost) : plan.actualCost,
      progress: progress !== undefined ? parseInt(progress) : plan.progress,
      assignedTo,
      tags,
      notes
    });

    res.json({
      success: true,
      data: plan,
      message: 'Plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete plan
router.delete('/:companyId/plans/:planId', async (req, res) => {
  try {
    const { companyId, planId } = req.params;
    
    const plan = await Plan.findOne({
      where: { id: planId, companyId }
    });

    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plan not found' 
      });
    }

    await plan.destroy();

    res.json({
      success: true,
      message: 'Plan deleted successfully',
      data: { planId }
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Report Management Routes

// Get all reports for a company
router.get('/:id/reports', async (req, res) => {
  try {
    const { id } = req.params;
    
    const reports = await Report.findAll({
      where: { companyId: id },
      include: [
        {
          model: Staff,
          as: 'creator',
          attributes: ['id', 'name', 'position']
        },
        {
          model: Staff,
          as: 'reviewer',
          attributes: ['id', 'name', 'position']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add report to company
router.post('/:id/reports', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type = 'performance',
      description,
      content,
      period,
      startDate,
      endDate,
      priority = 'medium',
      metrics,
      attachments,
      staffId
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Report title is required'
      });
    }

    const report = await Report.create({
      companyId: id,
      staffId,
      title: title.trim(),
      type,
      description,
      content,
      period,
      startDate,
      endDate,
      priority,
      metrics,
      attachments
    });

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report created successfully'
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
