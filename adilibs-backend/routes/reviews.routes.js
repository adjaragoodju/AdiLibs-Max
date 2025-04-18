// routes/reviews.routes.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { reviewValidations } = require('../validations');

router.get('/books/:bookId/reviews', reviewsController.getBookReviews);
router.post(
  '/books/:bookId/reviews',
  authenticateToken,
  validate(reviewValidations.addReview),
  reviewsController.addReview
);
router.put(
  '/reviews/:id',
  authenticateToken,
  validate(reviewValidations.updateReview),
  reviewsController.updateReview
);
router.delete(
  '/reviews/:id',
  authenticateToken,
  reviewsController.deleteReview
);
router.get('/my-reviews', authenticateToken, reviewsController.getUserReviews);

module.exports = router;
