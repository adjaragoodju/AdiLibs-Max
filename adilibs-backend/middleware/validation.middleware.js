// adilibs-backend/middleware/validation.middleware.js
const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data using express-validator
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Middleware function
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check if there are validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Return validation errors as response
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Continue to next middleware if validation passes
    next();
  };
};
