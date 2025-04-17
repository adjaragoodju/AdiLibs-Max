// scripts/init-db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
  try {
    console.log('Creating database tables...');

    // Read schema SQL
    const schema = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );

    // Execute schema SQL
    await pool.query(schema);

    console.log('Tables created successfully.');

    // Seed data if available
    const seedPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Seeding database...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('Database seeded successfully.');
    }

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    pool.end();
  }
};

initDb();
