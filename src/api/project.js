// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555/api';

// Project API functions
export const projectAPI = {
  // Get all projects
  getProjects: async (token, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_BASE_URL}/projects?${queryParams}` : `${API_BASE_URL}/projects`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (projectId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get project by ID error:', error);
      throw error;
    }
  },

  // Create new project
  createProject: async (token, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  },

  // Get project statistics
  getProjectStats: async (token, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_BASE_URL}/projects/stats/overview?${queryParams}` : `${API_BASE_URL}/projects/stats/overview`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project statistics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get project statistics error:', error);
      throw error;
    }
  }
};
