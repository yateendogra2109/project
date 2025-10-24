const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth API methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }

  // Notes API methods
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notes${queryString ? `?${queryString}` : ''}`);
  }

  async getNote(id) {
    return this.request(`/notes/${id}`);
  }

  async createNote(noteData) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData)
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}`, {
      method: 'DELETE'
    });
  }

  async bulkDeleteNotes(noteIds) {
    return this.request('/notes/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ noteIds })
    });
  }

  async getRecentNotes() {
    return this.request('/notes/recent');
  }

  async getNotesStats() {
    return this.request('/notes/stats');
  }

  // Categories API methods
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();