// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { userValidations } = require('../validations');

router.post(
  '/register',
  validate(userValidations.register),
  authController.register
);
router.post('/login', validate(userValidations.login), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
