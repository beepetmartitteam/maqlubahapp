// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5557/api';

// Todo List API functions
export const todoListAPI = {
  // Get all todo items
  getTodoItems: async (token, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_BASE_URL}/todo-list?${queryParams}` : `${API_BASE_URL}/todo-list`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todo items: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get todo items error:', error);
      throw error;
    }
  },

  // Get todo item by ID
  getTodoItemById: async (itemId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo-list/${itemId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todo item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get todo item by ID error:', error);
      throw error;
    }
  },

  // Create new todo item
  createTodoItem: async (token, todoData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo-list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create todo item error:', error);
      throw error;
    }
  },

  // Update todo item
  updateTodoItem: async (itemId, todoData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo-list/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update todo item error:', error);
      throw error;
    }
  },

  // Toggle todo item completion
  toggleTodoItem: async (itemId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo-list/${itemId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle todo item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Toggle todo item error:', error);
      throw error;
    }
  },

  // Delete todo item
  deleteTodoItem: async (itemId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo-list/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo item: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete todo item error:', error);
      throw error;
    }
  },

  // Get todo statistics
  getTodoStats: async (token, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_BASE_URL}/todo-list/stats/overview?${queryParams}` : `${API_BASE_URL}/todo-list/stats/overview`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todo statistics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get todo statistics error:', error);
      throw error;
    }
  }
};
