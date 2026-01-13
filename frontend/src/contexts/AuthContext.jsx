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

      if (parsedUser.token) {
        api.defaults.headers.common.Authorization =
          `Bearer ${parsedUser.token}`;
      }
    } catch {
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
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

      const response = await api.post(path, { email, password });
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
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } else {
        sessionStorage.setItem('user', JSON.stringify(normalizedUser));
      }

      navigate(normalizedUser.redirectUrl, { replace: true });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed';

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
