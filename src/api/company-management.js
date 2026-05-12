// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5557/api';

// Company Management API functions
export const companyManagementAPI = {
  // Get all companies
  getCompanies: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  },

  // Get company by ID
  getCompanyById: async (companyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get company by ID error:', error);
      throw error;
    }
  },

  // Create new company
  createCompany: async (token, companyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create company: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create company error:', error);
      throw error;
    }
  },

  // Update company
  updateCompany: async (companyId, companyData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update company: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (companyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete company: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete company error:', error);
      throw error;
    }
  },

  // Staff Management
  getStaffByCompany: async (companyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/staff`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  addStaff: async (companyId, staffData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/staff`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(staffData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add staff: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add staff error:', error);
      throw error;
    }
  },

  updateStaff: async (companyId, staffId, staffData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(staffData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update staff: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update staff error:', error);
      throw error;
    }
  },

  deleteStaff: async (companyId, staffId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete staff: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete staff error:', error);
      throw error;
    }
  },

  // Plan Management
  getPlansByCompany: async (companyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/plans`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get plans error:', error);
      throw error;
    }
  },

  addPlan: async (companyId, planData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add plan: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add plan error:', error);
      throw error;
    }
  },

  updatePlan: async (companyId, planId, planData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update plan: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update plan error:', error);
      throw error;
    }
  },

  deletePlan: async (companyId, planId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete plan: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete plan error:', error);
      throw error;
    }
  },

  // Report Management
  getReportsByCompany: async (companyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/reports`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  },

  addReport: async (companyId, reportData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/${companyId}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add report: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add report error:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-management/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};
