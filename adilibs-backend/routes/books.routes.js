// routes/books.routes.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBook);
router.post(
  '/:id/favorites',
  authenticateToken,
  booksController.addToFavorites
);
router.delete(
  '/:id/favorites',
  authenticateToken,
  booksController.removeFromFavorites
);
router.get('/favorites', authenticateToken, booksController.getFavoriteBooks);

module.exports = router;
