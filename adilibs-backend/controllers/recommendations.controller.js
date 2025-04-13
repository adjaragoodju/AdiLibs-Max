// controllers/recommendations.controller.js
exports.getPersonalizedRecommendations = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    // Get user's favorite genres based on reading history
    const favoriteGenresResult = await db.query(
      `
      SELECT g.id, g.name, COUNT(*) as book_count
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      JOIN book_genres bg ON b.id = bg.book_id
      JOIN genres g ON bg.genre_id = g.id
      WHERE ub.user_id = $1
      GROUP BY g.id, g.name
      ORDER BY book_count DESC
      LIMIT 3
    `,
      [userId]
    );

    if (favoriteGenresResult.rows.length === 0) {
      // User has no reading history, return popular books
      const popularBooksResult = await db.query(`
        SELECT b.*, a.name as author_name
        FROM books b
        JOIN authors a ON b.author_id = a.id
        ORDER BY b.rating_count DESC, b.average_rating DESC
        LIMIT 10
      `);

      return res.json({
        recommendations: popularBooksResult.rows,
        type: 'popular',
      });
    }

    // Get books in user's favorite genres that they haven't read
    const genreIds = favoriteGenresResult.rows.map((g) => g.id);
    const recommendationsResult = await db.query(
      `
      SELECT DISTINCT ON (b.id) b.*, a.name as author_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN user_books ub ON b.id = ub.book_id AND ub.user_id = $1
      WHERE bg.genre_id = ANY($2) AND ub.id IS NULL
      ORDER BY b.id, b.average_rating DESC
      LIMIT 10
    `,
      [userId, genreIds]
    );

    res.json({
      recommendations: recommendationsResult.rows,
      favoriteGenres: favoriteGenresResult.rows,
      type: 'personalized',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSimilarBooks = async (req, res) => {
  const { bookId } = req.params;
  const db = req.app.get('db');

  try {
    // Get book genres
    const bookGenresResult = await db.query(
      `
      SELECT g.id 
      FROM book_genres bg
      JOIN genres g ON bg.genre_id = g.id
      WHERE bg.book_id = $1
    `,
      [bookId]
    );

    if (bookGenresResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'Book not found or has no genres' });
    }

    // Get book author
    const bookAuthorResult = await db.query(
      `
      SELECT author_id
      FROM books
      WHERE id = $1
    `,
      [bookId]
    );

    const authorId = bookAuthorResult.rows[0]?.author_id;
    const genreIds = bookGenresResult.rows.map((g) => g.id);

    // controllers/recommendations.controller.js (continued)
    // Get similar books
    const similarBooksResult = await db.query(
      `
      SELECT DISTINCT ON (b.id) b.*, a.name as author_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      WHERE b.id != $1 AND (
        (bg.genre_id = ANY($2) AND b.author_id = $3) OR
        (bg.genre_id = ANY($2) AND b.author_id != $3)
      )
      ORDER BY b.id, 
               CASE WHEN b.author_id = $3 THEN 0 ELSE 1 END,
               b.average_rating DESC
      LIMIT 10
    `,
      [bookId, genreIds, authorId]
    );

    res.json(similarBooksResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPopularInGenre = async (req, res) => {
  const { genreId } = req.params;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT b.*, a.name as author_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      WHERE bg.genre_id = $1
      ORDER BY b.rating_count DESC, b.average_rating DESC
      LIMIT 10
    `,
      [genreId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
