// controllers/users.controller.js
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { ApiError } = require('../middleware/error.middleware');

exports.getProfile = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT id, email, name, bio, avatar_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { name, bio, avatarUrl } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET 
         name = COALESCE($1, name), 
         bio = COALESCE($2, bio), 
         avatar_url = COALESCE($3, avatar_url),
         updated_at = NOW()
       WHERE id = $4 
       RETURNING id, email, name, bio, avatar_url, created_at`,
      [name, bio, avatarUrl, userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    logger.info(`User profile updated: ${userId}`);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new ApiError(400, 'Current password and new password are required')
    );
  }

  try {
    // Get current user with password
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    const user = userResult.rows[0];

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    logger.info(`Password changed for user: ${userId}`);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return next(new ApiError(400, 'Password is required to delete account'));
  }

  try {
    // Get current user with password
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    const user = userResult.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new ApiError(401, 'Password is incorrect');
    }

    // Use transaction to delete user and all related data
    await db.transaction(async (client) => {
      // Delete refresh tokens
      await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [
        userId,
      ]);

      // Delete user favorites
      await client.query('DELETE FROM user_favorite_books WHERE user_id = $1', [
        userId,
      ]);

      // Delete user author follows
      await client.query('DELETE FROM user_author_follows WHERE user_id = $1', [
        userId,
      ]);

      // Delete reviews
      await client.query('DELETE FROM reviews WHERE user_id = $1', [userId]);

      // Delete user books
      await client.query('DELETE FROM user_books WHERE user_id = $1', [userId]);

      // Finally delete the user
      await client.query('DELETE FROM users WHERE id = $1', [userId]);
    });

    logger.info(`User account deleted: ${userId}`);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
