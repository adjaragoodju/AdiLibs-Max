// adilibs-backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { ApiError } = require('./error.middleware');

/**
 * Middleware to authenticate user tokens
 * Verifies the JWT token from the Authorization header
 */
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired'));
      }
      return next(new ApiError(403, 'Invalid token'));
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware to authenticate but not require authentication
 * Sets req.user if token is valid, but continues regardless
 */
exports.optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};
