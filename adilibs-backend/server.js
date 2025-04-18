// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    logger.error('Error acquiring client', { error: err.stack });
    return;
  }
  logger.info('Connected to PostgreSQL database');
  release();
});

// Make db available to routes
app.set('db', pool);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.httpLogger); // Add custom HTTP logger

// Test route
app.get('/', (req, res) => {
  res.send('Server is running! ✅');
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/books', require('./routes/books.routes'));
app.use('/api/authors', require('./routes/authors.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/user-books', require('./routes/userBooks.routes'));
app.use('/api/recommendations', require('./routes/recommendations.routes'));

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  logger.info('Closing database pool and shutting down server...');

  server.close(() => {
    logger.info('HTTP server closed');

    pool.end(() => {
      logger.info('Database pool closed');
      process.exit(0);
    });
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}
