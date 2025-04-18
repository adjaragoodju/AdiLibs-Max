// controllers/recommendations.controller.js

// Add a function to calculate content-based recommendations
const getContentBasedRecommendations = async (db, userId, limit = 10) => {
  // Get user's book history with ratings
  const userHistory = await db.query(
    `
    SELECT b.id, b.title, r.rating, array_agg(g.id) as genre_ids
    FROM user_books ub
    JOIN books b ON ub.book_id = b.id
    LEFT JOIN reviews r ON r.user_id = ub.user_id AND r.book_id = b.id
    JOIN book_genres bg ON b.id = bg.book_id
    JOIN genres g ON bg.genre_id = g.id
    WHERE ub.user_id = $1
    GROUP BY b.id, b.title, r.rating
  `,
    [userId]
  );

  if (userHistory.rows.length === 0) {
    return [];
  }

  // Extract user's genre preferences with weights
  const genrePreferences = new Map();

  userHistory.rows.forEach((book) => {
    // Use rating as weight, default to 3 if no rating
    const weight = book.rating ? book.rating : 3;

    book.genre_ids.forEach((genreId) => {
      genrePreferences.set(
        genreId,
        (genrePreferences.get(genreId) || 0) + weight
      );
    });
  });

  // Normalize weights
  const totalWeight = Array.from(genrePreferences.values()).reduce(
    (sum, val) => sum + val,
    0
  );

  genrePreferences.forEach((value, key) => {
    genrePreferences.set(key, value / totalWeight);
  });

  // Get read book IDs to exclude
  const readBookIds = userHistory.rows.map((book) => book.id);

  // Get recommendations based on genre preferences
  const recommendationsResult = await db.query(
    `
    WITH book_scores AS (
      SELECT 
        b.id,
        b.title,
        b.image_url,
        a.name as author_name,
        b.average_rating,
        b.rating_count,
        SUM(
          CASE 
            WHEN bg.genre_id = ANY($1) THEN 
              $2[array_position($1, bg.genre_id)] * b.average_rating 
            ELSE 0 
          END
        ) as score
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      WHERE b.id <> ALL($3)
      GROUP BY b.id, a.name
    )
    SELECT * FROM book_scores
    ORDER BY score DESC, average_rating DESC
    LIMIT $4
  `,
    [
      Array.from(genrePreferences.keys()),
      Array.from(genrePreferences.values()),
      readBookIds,
      limit,
    ]
  );

  return recommendationsResult.rows;
};

// Then use this function in your controller
exports.getPersonalizedRecommendations = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    // Try content-based recommendations first
    const recommendations = await getContentBasedRecommendations(db, userId);

    if (recommendations.length > 0) {
      return res.json({
        recommendations,
        type: 'personalized',
      });
    }

    // Fall back to popular books if no recommendations
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Implement the missing getSimilarBooks function
exports.getSimilarBooks = async (req, res) => {
  const { bookId } = req.params;
  const db = req.app.get('db');

  try {
    // Get the book's genres
    const bookGenresResult = await db.query(
      `
      SELECT g.id, g.name
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

    // Get the book's author
    const bookAuthorResult = await db.query(
      `
      SELECT author_id
      FROM books
      WHERE id = $1
    `,
      [bookId]
    );

    if (bookAuthorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const authorId = bookAuthorResult.rows[0].author_id;
    const genreIds = bookGenresResult.rows.map((g) => g.id);

    // Find similar books based on matching genres and same author
    // Exclude the current book
    const similarBooksResult = await db.query(
      `
      SELECT DISTINCT ON (b.id) b.*, a.name as author_name, array_agg(DISTINCT g.name) as genres,
        COUNT(DISTINCT bg2.genre_id) as genre_match_count,
        CASE WHEN b.author_id = $1 THEN 1 ELSE 0 END as same_author
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      JOIN genres g ON bg.genre_id = g.id
      JOIN book_genres bg2 ON bg.book_id = bg2.book_id AND bg2.genre_id = ANY($2)
      WHERE b.id <> $3
      GROUP BY b.id, a.name
      ORDER BY same_author DESC, genre_match_count DESC, b.average_rating DESC
      LIMIT 8
    `,
      [authorId, genreIds, bookId]
    );

    res.json(similarBooksResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Implement the missing getPopularInGenre function
exports.getPopularInGenre = async (req, res) => {
  const { genreId } = req.params;
  const db = req.app.get('db');

  try {
    // Check if genre exists
    const genreResult = await db.query('SELECT * FROM genres WHERE id = $1', [
      genreId,
    ]);

    if (genreResult.rows.length === 0) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    // Get popular books in genre
    const booksResult = await db.query(
      `
      SELECT b.*, a.name as author_name, array_agg(DISTINCT g.name) as genres
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN book_genres bg ON b.id = bg.book_id
      JOIN genres g ON bg.genre_id = g.id
      WHERE bg.genre_id = $1
      GROUP BY b.id, a.name
      ORDER BY b.average_rating DESC, b.rating_count DESC
      LIMIT 10
    `,
      [genreId]
    );

    res.json({
      genre: genreResult.rows[0],
      books: booksResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
