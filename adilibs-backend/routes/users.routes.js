// routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { userValidations } = require('../validations');

router.get('/profile', authenticateToken, usersController.getProfile);
router.put(
  '/profile',
  authenticateToken,
  validate(userValidations.updateProfile),
  usersController.updateProfile
);
router.put(
  '/password',
  authenticateToken,
  validate(userValidations.changePassword),
  usersController.changePassword
);

module.exports = router;
