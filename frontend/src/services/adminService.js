// Align base URL with axios client default to avoid mixed-content / wrong host errors
const apiBase = import.meta.env.VITE_API_BASE_URL || "https://have-dominion.onrender.com";
const API_BASE = `${apiBase}/api/v1`;

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

  // Get all contacts
  async getContacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/contact${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Update contact status
  async updateContactStatus(contactId, status) {
    const response = await fetch(`${API_BASE}/contact/${contactId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return handleResponse(response);
  },

  // Delete contact
  async deleteContact(contactId) {
    const response = await fetch(`${API_BASE}/contact/${contactId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Get all tradelines
  async getTradelines(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/tradeline${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Get tradeline by ID
  async getTradelineById(tradelineId) {
    const response = await fetch(`${API_BASE}/tradeline/${tradelineId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Create tradeline
  async createTradeline(tradelineData) {
    const response = await fetch(`${API_BASE}/tradeline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tradelineData),
    });
    
    return handleResponse(response);
  },

  // Update tradeline
  async updateTradeline(tradelineId, tradelineData) {
    const response = await fetch(`${API_BASE}/tradeline/${tradelineId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tradelineData),
    });
    
    return handleResponse(response);
  },

  // Delete tradeline
  async deleteTradeline(tradelineId) {
    const response = await fetch(`${API_BASE}/tradeline/${tradelineId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  // Get statistics
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE}/admin/statistics`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Statistics fetch error:', error);
      // If it's a network error (ERR_BLOCKED_BY_CLIENT, CORS, etc.), provide helpful message
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your connection or disable browser extensions that might be blocking requests.');
      }
      throw error;
    }
  }
};
