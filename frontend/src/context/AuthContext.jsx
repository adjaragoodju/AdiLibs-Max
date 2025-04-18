// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

// Create auth context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state by checking for stored token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // If no token, just finish loading
        if (!token) {
          setLoading(false);
          setInitialized(true);
          return;
        }

        // Fetch user profile using stored token
        const response = await apiService.users.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);

        // Try to refresh token if possible
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const refreshResponse = await apiService.auth.refreshToken(
              refreshToken
            );
            localStorage.setItem(
              'accessToken',
              refreshResponse.data.accessToken
            );
            setUser(refreshResponse.data.user);
          }
        } catch (refreshErr) {
          // Clear tokens if refresh failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Register a new user
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.register(userData);

      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Set user
      setUser(response.data.user);

      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.auth.login(credentials);

      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Set user
      setUser(response.data.user);

      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiService.auth.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.users.updateProfile(profileData);
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.user,
      }));
      return response.data.user;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.users.changePassword(passwordData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth context value
  const value = {
    user,
    loading,
    error,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
