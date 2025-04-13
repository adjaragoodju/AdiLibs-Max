// routes/recommendations.routes.js
const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get(
  '/personalized',
  authenticateToken,
  recommendationsController.getPersonalizedRecommendations
);
router.get('/similar/:bookId', recommendationsController.getSimilarBooks);
router.get('/genre/:genreId', recommendationsController.getPopularInGenre);

module.exports = router;
