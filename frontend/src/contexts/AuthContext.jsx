// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    setLoading(false);
  }, []);

  // Register a new user
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API success
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {
        refreshToken: currentRefreshToken,
      });

      const { accessToken, user: refreshedUser } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(refreshedUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(refreshedUser);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      // If refresh fails, log out the user
      logout();
      return false;
    }
  }, [logout]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', profileData);

      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);
      setError(null);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
