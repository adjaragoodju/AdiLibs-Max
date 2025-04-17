// scripts/generate-seeds.js
const fs = require('fs');
const path = require('path');

// Read books JSON data
const booksData = require('../frontend/src/data/books.json');

// Set to track unique authors
const authors = new Set();
// Set to track unique genres
const genres = new Set();

// Extract authors and genres
booksData.forEach((book) => {
  authors.add(book.author);
  genres.add(book.genre);
});

// Generate SQL
let sql = `-- Seed data for AdiLibs database\n\n`;

// Insert genres
sql += `-- Insert genres\n`;
Array.from(genres).forEach((genre, index) => {
  sql += `INSERT INTO genres (id, name) VALUES (${index + 1}, '${genre.replace(
    /'/g,
    "''"
  )}');\n`;
});

// Insert authors
sql += `\n-- Insert authors\n`;
const authorMap = {};
Array.from(authors).forEach((author, index) => {
  authorMap[author] = index + 1;
  sql += `INSERT INTO authors (id, name, image_url) VALUES (${
    index + 1
  }, '${author.replace(/'/g, "''")}', '/${author
    .toLowerCase()
    .replace(/\s+/g, '-')}.jpg');\n`;
});

// Insert books
sql += `\n-- Insert books\n`;
booksData.forEach((book, index) => {
  const authorId = authorMap[book.author];
  sql += `INSERT INTO books (id, title, author_id, year, image_url, average_rating, rating_count) 
          VALUES (${index + 1}, '${book.title.replace(
    /'/g,
    "''"
  )}', ${authorId}, '${book.year}', '${book.image}', ${
    Math.random() * 4 + 1
  }, ${Math.floor(Math.random() * 1000)});\n`;
});

// Insert book_genres
sql += `\n-- Insert book_genres relationships\n`;
booksData.forEach((book, index) => {
  const genreId = Array.from(genres).indexOf(book.genre) + 1;
  sql += `INSERT INTO book_genres (book_id, genre_id) VALUES (${
    index + 1
  }, ${genreId});\n`;
});

// Write SQL to file
fs.writeFileSync(path.join(__dirname, '../database/seed.sql'), sql, 'utf8');

console.log('Seed SQL generated successfully!');
