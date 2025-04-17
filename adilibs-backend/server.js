// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const dotenv = require('dotenv');

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
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// Make db available to routes
app.set('db', pool);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔽 Тестовый маршрут для проверки сервера
app.get('/', (req, res) => {
  res.send('Сервер работает! ✅');
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/books', require('./routes/books.routes'));
app.use('/api/authors', require('./routes/authors.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/user-books', require('./routes/userBooks.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
