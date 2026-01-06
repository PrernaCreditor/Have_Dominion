const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Get auth token from localStorage or sessionStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Common headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }
  }
  
  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

export const adminService = {
  // Get all users
  async getAllUsers(page = 1, limit = 10, isActive) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (isActive !== undefined) {
      params.append('isActive', isActive.toString());
    }
    
    const response = await fetch(`${API_BASE}/admin/users?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Get user by ID
  async getUserById(userId) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Update user
  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  // Delete user
  async deleteUser(userId) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Deactivate user
  async deactivateUser(userId) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/deactivate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Activate user
  async activateUser(userId) {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/activate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Get statistics
  async getStatistics() {
    const response = await fetch(`${API_BASE}/admin/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  }
};
