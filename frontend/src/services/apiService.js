// frontend/src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Handle 401 Unauthorized errors (token expired)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add the request to queue
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Attempt to refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, logout user
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Update stored tokens
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Process queued requests with new token
        processQueue(null, accessToken);

        // Update auth header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token, logout user
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Auth
  auth: {
    register: (userData) => axiosInstance.post('/auth/register', userData),
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    logout: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      return axiosInstance.post('/auth/logout', { refreshToken });
    },
    refreshToken: (refreshToken) =>
      axiosInstance.post('/auth/refresh', { refreshToken }),
  },

  // Users
  users: {
    getProfile: () => axiosInstance.get('/users/profile'),
    updateProfile: (profileData) =>
      axiosInstance.put('/users/profile', profileData),
    changePassword: (passwordData) =>
      axiosInstance.put('/users/password', passwordData),
  },

  // Books
  books: {
    getBooks: (params) => axiosInstance.get('/books', { params }),
    getBook: (id) => axiosInstance.get(`/books/${id}`),
    addToFavorites: (id) => axiosInstance.post(`/books/${id}/favorites`),
    removeFromFavorites: (id) => axiosInstance.delete(`/books/${id}/favorites`),
    getFavoriteBooks: () => axiosInstance.get('/books/favorites'),
  },

  // Authors
  authors: {
    getAuthors: (params) => axiosInstance.get('/authors', { params }),
    getAuthor: (id) => axiosInstance.get(`/authors/${id}`),
    followAuthor: (id) => axiosInstance.post(`/authors/${id}/follow`),
    unfollowAuthor: (id) => axiosInstance.delete(`/authors/${id}/follow`),
    getFollowedAuthors: () => axiosInstance.get('/authors/following'),
  },

  // Reviews
  reviews: {
    getBookReviews: (bookId) => axiosInstance.get(`/books/${bookId}/reviews`),
    addReview: (bookId, reviewData) =>
      axiosInstance.post(`/books/${bookId}/reviews`, reviewData),
    updateReview: (id, reviewData) =>
      axiosInstance.put(`/reviews/${id}`, reviewData),
    deleteReview: (id) => axiosInstance.delete(`/reviews/${id}`),
    getUserReviews: () => axiosInstance.get('/my-reviews'),
  },

  // User Books
  userBooks: {
    getUserBooks: () => axiosInstance.get('/user-books'),
    getUserBooksByStatus: (status) =>
      axiosInstance.get(`/user-books/status/${status}`),
    addUserBook: (bookData) => axiosInstance.post('/user-books', bookData),
    updateUserBook: (id, bookData) =>
      axiosInstance.put(`/user-books/${id}`, bookData),
    updateReadingProgress: (id, progressData) =>
      axiosInstance.patch(`/user-books/${id}/reading-progress`, progressData),
    getReadingStats: () => axiosInstance.get('/user-books/stats'),
  },

  // Recommendations
  recommendations: {
    getPersonalizedRecommendations: () =>
      axiosInstance.get('/recommendations/personalized'),
    getSimilarBooks: (bookId) =>
      axiosInstance.get(`/recommendations/similar/${bookId}`),
    getPopularInGenre: (genreId) =>
      axiosInstance.get(`/recommendations/genre/${genreId}`),
  },
};

export default apiService;
