// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5557/api';

// Member Management API functions
export const memberAPI = {
  // Get all members
  getMembers: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Members fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Members fetch error:', error);
      throw error;
    }
  },

  // Get member by ID
  getMemberById: async (memberId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member fetch error:', error);
      throw error;
    }
  },

  // Create new member
  createMember: async (token, memberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        throw new Error(`Member creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member creation error:', error);
      throw error;
    }
  },

  // Update member
  updateMember: async (memberId, memberData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        throw new Error(`Member update failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member update error:', error);
      throw error;
    }
  },

  // Delete member
  deleteMember: async (memberId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member deletion failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member deletion error:', error);
      throw error;
    }
  },

  // Get member statistics
  getMemberStats: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member stats fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member stats fetch error:', error);
      throw error;
    }
  },

  // Search members
  searchMembers: async (token, searchParams) => {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${API_BASE_URL}/members/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member search error:', error);
      throw error;
    }
  },

  // Filter members by state and status
  filterMembers: async (token, filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/members/filter?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member filter failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member filter error:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Member health check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Member health check error:', error);
      throw error;
    }
  }
};
