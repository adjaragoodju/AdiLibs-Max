// routes/authors.routes.js
const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authorValidations } = require('../validations');

router.get(
  '/',
  validate(authorValidations.getAuthors),
  authorsController.getAuthors
);
router.get(
  '/:id',
  validate(authorValidations.authorId),
  authorsController.getAuthor
);
router.post(
  '/:id/follow',
  authenticateToken,
  validate(authorValidations.authorId),
  authorsController.followAuthor
);
router.delete(
  '/:id/follow',
  authenticateToken,
  validate(authorValidations.authorId),
  authorsController.unfollowAuthor
);
router.get(
  '/following',
  authenticateToken,
  authorsController.getFollowedAuthors
);

module.exports = router;
