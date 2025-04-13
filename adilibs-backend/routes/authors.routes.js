// routes/authors.routes.js
const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authorsController.getAuthors);
router.get('/:id', authorsController.getAuthor);
router.post('/:id/follow', authenticateToken, authorsController.followAuthor);
router.delete(
  '/:id/follow',
  authenticateToken,
  authorsController.unfollowAuthor
);
router.get(
  '/following',
  authenticateToken,
  authorsController.getFollowedAuthors
);

module.exports = router;
