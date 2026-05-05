// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Customer Notes API functions
export const notesAPI = {
  // Get all notes for a customer
  getCustomerNotes: async (customerId,token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get notes error:', error);
      throw error;
    }
  },

  // Create new note with images
  createNote: async (token, customerId, noteData, images) => {
    try {
      const formData = new FormData();
      
      // Add note data
      formData.append('caption', noteData.caption || '');
      formData.append('note', noteData.note || '');

      // Add images if provided
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create note error:', error);
      throw error;
    }
  },

  // Create customer note (updated signature)
  createCustomerNote: async (customerId, noteData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create customer note error:', error);
      throw error;
    }
  },

  // Delete note
  deleteNote: async (noteId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete note error:', error);
      throw error;
    }
  }
};
