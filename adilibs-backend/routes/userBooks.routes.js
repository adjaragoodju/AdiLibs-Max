// routes/userBooks.routes.js
const express = require('express');
const router = express.Router();
const userBooksController = require('../controllers/userBooks.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { userBooksValidations } = require('../validations');

router.get('/', authenticateToken, userBooksController.getUserBooks);
router.get(
  '/status/:status',
  authenticateToken,
  userBooksController.getUserBooksByStatus
);
router.post(
  '/',
  authenticateToken,
  validate(userBooksValidations.addUserBook),
  userBooksController.addUserBook
);
router.put(
  '/:id',
  authenticateToken,
  validate(userBooksValidations.updateUserBook),
  userBooksController.updateUserBook
);
router.patch(
  '/:id/reading-progress',
  authenticateToken,
  validate(userBooksValidations.updateReadingProgress),
  userBooksController.updateReadingProgress
);
router.get('/stats', authenticateToken, userBooksController.getReadingStats);

module.exports = router;
