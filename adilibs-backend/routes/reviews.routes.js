// routes/reviews.routes.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/books/:bookId/reviews', reviewsController.getBookReviews);
router.post(
  '/books/:bookId/reviews',
  authenticateToken,
  reviewsController.addReview
);
router.put('/reviews/:id', authenticateToken, reviewsController.updateReview);
router.delete(
  '/reviews/:id',
  authenticateToken,
  reviewsController.deleteReview
);
router.get('/my-reviews', authenticateToken, reviewsController.getUserReviews);

module.exports = router;
