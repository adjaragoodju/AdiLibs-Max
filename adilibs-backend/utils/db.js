// adilibs-backend/utils/db.js
const { Pool } = require('pg');
const logger = require('./logger');

// Create a pool of database connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection error', { error: err.message });
    process.exit(1); // Exit with error if cannot connect to database
  } else {
    logger.info('Connected to PostgreSQL database');
  }
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

module.exports = {
  /**
   * Execute a database query
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise} - Query result
   */
  query: (text, params) => {
    logger.debug('DB Query', { query: text, params });
    return pool.query(text, params);
  },

  /**
   * Get a client from the pool for transactions
   * @returns {Promise} - Client connection
   */
  getClient: async () => {
    const client = await pool.connect();
    const originalQuery = client.query;

    // Wrap query function to add logging
    client.query = (...args) => {
      logger.debug('DB Transaction Query', { query: args[0] });
      return originalQuery.apply(client, args);
    };

    return client;
  },

  /**
   * Execute queries within a transaction
   * @param {Function} callback - Callback function with transaction client
   * @returns {Promise} - Transaction result
   */
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await callback(client);

      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  /**
   * Close database pool (for graceful shutdown)
   */
  close: () => {
    return pool.end();
  },
};
