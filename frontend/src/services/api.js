// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;

        // Update localStorage and axios default headers
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear local storage and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Force page reload to reset app state
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
