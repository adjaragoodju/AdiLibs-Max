// frontend/src/hooks/useAuth.js
import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import apiService from '../services/apiService';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiService.users.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        // Don't set error here to avoid showing error on initial load
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

  // Register function
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

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiService.auth.logout();
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
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Protected route hook
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const [redirectPath, setRedirectPath] = useState('/login');

  // Set redirect path with current location
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register') {
      setRedirectPath(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, []);

  return {
    isAuthenticated: !!user,
    isLoading: loading,
    redirectPath,
  };
}
