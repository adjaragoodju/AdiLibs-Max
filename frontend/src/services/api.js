// src/services/api.js (in your React frontend)
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
// src/services/api.js (continued)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Update stored tokens
        localStorage.setItem('accessToken', res.data.accessToken);

        // Update auth header and retry
        originalRequest.headers[
          'Authorization'
        ] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Define API services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/password', passwordData),
};

export const bookService = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  addToFavorites: (id) => api.post(`/books/${id}/favorites`),
  removeFromFavorites: (id) => api.delete(`/books/${id}/favorites`),
  getFavoriteBooks: () => api.get('/books/favorites'),
};

export const authorService = {
  getAuthors: (params) => api.get('/authors', { params }),
  getAuthor: (id) => api.get(`/authors/${id}`),
  followAuthor: (id) => api.post(`/authors/${id}/follow`),
  unfollowAuthor: (id) => api.delete(`/authors/${id}/follow`),
  getFollowedAuthors: () => api.get('/authors/following'),
};

export const reviewService = {
  getBookReviews: (bookId) => api.get(`/books/${bookId}/reviews`),
  addReview: (bookId, reviewData) =>
    api.post(`/books/${bookId}/reviews`, reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  getUserReviews: () => api.get('/my-reviews'),
};

export const userBookService = {
  getUserBooks: () => api.get('/user-books'),
  getUserBooksByStatus: (status) => api.get(`/user-books/status/${status}`),
  addUserBook: (bookData) => api.post('/user-books', bookData),
  updateUserBook: (id, bookData) => api.put(`/user-books/${id}`, bookData),
  updateReadingProgress: (id, progressData) =>
    api.patch(`/user-books/${id}/reading-progress`, progressData),
  getReadingStats: () => api.get('/user-books/stats'),
};

export const recommendationService = {
  getPersonalizedRecommendations: () =>
    api.get('/recommendations/personalized'),
  getSimilarBooks: (bookId) => api.get(`/recommendations/similar/${bookId}`),
  getPopularInGenre: (genreId) => api.get(`/recommendations/genre/${genreId}`),
};
