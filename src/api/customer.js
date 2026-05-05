// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Customer API functions
export const customerAPI = {
  // Get all customers for authenticated user
  getCustomers: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (customerId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get customer by ID error:', error);
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (token, customerData, images) => {
    try {
      // Prepare data with images
      const data = {
        ...customerData,
        images: images || []
      };

      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (customerId, customerData, token, images) => {
    try {
      // Prepare data with images
      const data = {
        ...customerData,
        images: images || []
      };

      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (token, customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete customer error:', error);
      throw error;
    }
  }
};
