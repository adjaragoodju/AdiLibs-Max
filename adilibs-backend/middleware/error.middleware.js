// adilibs-backend/middleware/error.middleware.js

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Convert errors from other libraries to ApiError
 */
const convertError = (err) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  return error;
};

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  const error = convertError(err);

  // Log error
  console.error(error);

  // Get status code or default to 500
  const statusCode = error.statusCode || 500;

  // Create response object
  const response = {
    status: 'error',
    message: error.message,
  };

  // Add stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Not found error handler - for routes that don't exist
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
};
