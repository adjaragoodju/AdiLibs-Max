// adilibs-backend/validations/index.js
const { body, param, query } = require('express-validator');

/**
 * User and authentication validation schemas
 */
exports.userValidations = {
  // User registration validation
  register: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
  ],

  // User login validation
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  // User profile update validation
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('avatarUrl')
      .optional()
      .isURL()
      .withMessage('Please provide a valid URL for the avatar'),
  ],

  // Password change validation
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  ],
};

/**
 * Book-related validation schemas
 */
exports.bookValidations = {
  // Book query validation
  getBooks: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn(['title', 'author', 'year', 'rating'])
      .withMessage('Sort must be one of: title, author, year, rating'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be either asc or desc'),
    query('genre').optional().trim(),
  ],

  // Book ID validation
  bookId: [param('id').isInt({ min: 1 }).withMessage('Invalid book ID')],
};

/**
 * Review-related validation schemas
 */
exports.reviewValidations = {
  // Add review validation
  addReview: [
    param('bookId').isInt({ min: 1 }).withMessage('Invalid book ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Review content is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Review must be between 10 and 2000 characters'),
  ],

  // Update review validation
  updateReview: [
    param('id').isInt({ min: 1 }).withMessage('Invalid review ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Review must be between 10 and 2000 characters'),
  ],
};

/**
 * User Books validation schemas
 */
exports.userBooksValidations = {
  // Add user book validation
  addUserBook: [
    body('bookId').isInt({ min: 1 }).withMessage('Invalid book ID'),
    body('status')
      .isIn(['want_to_read', 'reading', 'completed', 'did_not_finish'])
      .withMessage('Invalid status'),
    body('currentPage')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current page must be a non-negative integer'),
  ],

  // Update user book validation
  updateUserBook: [
    param('id').isInt({ min: 1 }).withMessage('Invalid user book ID'),
    body('status')
      .optional()
      .isIn(['want_to_read', 'reading', 'completed', 'did_not_finish'])
      .withMessage('Invalid status'),
    body('currentPage')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current page must be a non-negative integer'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
  ],

  // Update reading progress validation
  updateReadingProgress: [
    param('id').isInt({ min: 1 }).withMessage('Invalid user book ID'),
    body('currentPage')
      .isInt({ min: 0 })
      .withMessage('Current page must be a non-negative integer'),
  ],
};

/**
 * Author-related validation schemas
 */
exports.authorValidations = {
  // Author query validation
  getAuthors: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  // Author ID validation
  authorId: [param('id').isInt({ min: 1 }).withMessage('Invalid author ID')],
};
