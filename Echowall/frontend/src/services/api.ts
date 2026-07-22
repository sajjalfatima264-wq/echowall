const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`API GET Error [${endpoint}]:`, error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData.detail || 'Network response was not ok';
      }
      return await response.json();
    } catch (error) {
      console.error(`API POST Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // NEW DELETE METHOD ADDED HERE
  async delete(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData.detail || 'Network response was not ok';
      }
      return await response.json();
    } catch (error) {
      console.error(`API DELETE Error [${endpoint}]:`, error);
      throw error;
    }
  },
};