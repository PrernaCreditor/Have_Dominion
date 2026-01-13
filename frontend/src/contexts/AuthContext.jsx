import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================================
     Restore auth on page refresh
     ================================ */
  useEffect(() => {
    const storedUser =
      sessionStorage.getItem('user') || localStorage.getItem('user');

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setError(null); // Clear any previous errors when restoring user

      if (parsedUser.token) {
        api.defaults.headers.common.Authorization =
          `Bearer ${parsedUser.token}`;
      }
    } catch {
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================================
     Login (explicit role-based)
     ================================ */
  const login = async (email, password, role = 'user', rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const path =
        role === 'admin'
          ? 'auth/admin/login'
          : 'auth/user/login';

      console.log('Attempting login:', { email, role, path });
      const response = await api.post(path, { email, password });
      console.log('Login response:', response.data);
      
      const { user: userResp, token } = response.data.data;

      if (!userResp || !token) {
        throw new Error('Invalid login response');
      }

      const normalizedUser = {
        id: userResp._id || userResp.id,
        email: userResp.email,
        name: userResp.name,
        role: userResp.role.toLowerCase(),
        token,
        redirectUrl:
          userResp.role.toLowerCase() === 'admin'
            ? '/admin/dashboard'
            : '/dashboard',
      };

      // Save user
      setUser(normalizedUser);
      setError(null); // Clear any previous errors on successful login
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(normalizedUser));
      }

      navigate(normalizedUser.redirectUrl, { replace: true });
      return { success: true };
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        fullResponse: JSON.stringify(err.response?.data, null, 2),
      });

      let message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Login failed';

      // Provide helpful hint if using admin email on user login
      if (role === 'user' && email.toLowerCase().includes('admin')) {
        message += '. Note: Admin accounts should use the Admin Login page.';
      }

      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     Logout
     ================================ */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore backend failure
    } finally {
      setUser(null);
      setError(null); // Clear error on logout
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      delete api.defaults.headers.common.Authorization;
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    loading,
    error,
    login,
    logout,
  };

  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
