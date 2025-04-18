// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');
const logger = require('../utils/logger');
const { ApiError } = require('../middleware/error.middleware');

// Helper functions
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, tokenId: uuidv4() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Controller methods
exports.register = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to create user and handle related operations
    const result = await db.transaction(async (client) => {
      // Create user
      const userResult = await client.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
        [email, hashedPassword, name]
      );

      const user = userResult.rows[0];

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in database with expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

      await client.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, refreshToken, expiryDate]
      );

      return {
        user,
        accessToken,
        refreshToken,
      };
    });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Clean up old refresh tokens for this user
    await db.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()',
      [user.id]
    );

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiryDate]
    );

    // Remove password from response
    delete user.password;

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(401, 'Refresh token required'));
  }

  try {
    // Check if token exists and is valid
    const tokenResult = await db.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      throw new ApiError(403, 'Invalid or expired refresh token');
    }

    // Verify token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return next(new ApiError(403, 'Invalid refresh token'));
        }

        // Get user
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [
          decoded.id,
        ]);

        if (userResult.rows.length === 0) {
          return next(new ApiError(404, 'User not found'));
        }

        const currentUser = userResult.rows[0];
        delete currentUser.password;

        // Generate new access token
        const accessToken = generateAccessToken(currentUser);

        logger.info(`Token refreshed for user ID: ${currentUser.id}`);

        res.json({
          accessToken,
          user: currentUser,
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(400, 'Refresh token required'));
  }

  try {
    // Delete refresh token
    const result = await db.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );

    if (result.rowCount > 0) {
      logger.info('User logged out successfully');
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
