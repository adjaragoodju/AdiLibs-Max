// routes/books.routes.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { bookValidations } = require('../validations');

router.get('/', validate(bookValidations.getBooks), booksController.getBooks);
router.get('/:id', validate(bookValidations.bookId), booksController.getBook);
router.post(
  '/:id/favorites',
  authenticateToken,
  validate(bookValidations.bookId),
  booksController.addToFavorites
);
router.delete(
  '/:id/favorites',
  authenticateToken,
  validate(bookValidations.bookId),
  booksController.removeFromFavorites
);
router.get('/favorites', authenticateToken, booksController.getFavoriteBooks);

module.exports = router;
