// routes/userBooks.routes.js
const express = require('express');
const router = express.Router();
const userBooksController = require('../controllers/userBooks.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, userBooksController.getUserBooks);
router.get(
  '/status/:status',
  authenticateToken,
  userBooksController.getUserBooksByStatus
);
router.post('/', authenticateToken, userBooksController.addUserBook);
router.put('/:id', authenticateToken, userBooksController.updateUserBook);
router.patch(
  '/:id/reading-progress',
  authenticateToken,
  userBooksController.updateReadingProgress
);
router.get('/stats', authenticateToken, userBooksController.getReadingStats);

module.exports = router;
