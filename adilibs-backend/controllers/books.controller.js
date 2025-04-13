// controllers/books.controller.js
exports.getBooks = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    genre,
    author,
    sort = 'rating',
    order = 'desc',
  } = req.query;
  const offset = (page - 1) * limit;
  const db = req.app.get('db');

  try {
    let query = `
      SELECT DISTINCT ON (b.id) b.*, a.name as author_name, array_agg(DISTINCT g.name) as genres
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
    `;

    const queryParams = [];
    const whereConditions = [];

    // Add search condition
    if (search) {
      whereConditions.push(
        `(b.title ILIKE $${queryParams.length + 1} OR a.name ILIKE $${
          queryParams.length + 1
        })`
      );
      queryParams.push(`%${search}%`);
    }

    // Add genre condition
    if (genre) {
      whereConditions.push(`g.name = $${queryParams.length + 1}`);
      queryParams.push(genre);
    }

    // Add author condition
    if (author) {
      whereConditions.push(`a.id = $${queryParams.length + 1}`);
      queryParams.push(author);
    }

    // Add WHERE clause if conditions exist
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // Add GROUP BY
    query += ` GROUP BY b.id, a.name`;

    // Add ORDER BY
    let orderByColumn;
    switch (sort) {
      case 'title':
        orderByColumn = 'b.title';
        break;
      case 'author':
        orderByColumn = 'a.name';
        break;
      case 'year':
        orderByColumn = 'b.year';
        break;
      case 'rating':
      default:
        orderByColumn = 'b.average_rating';
        break;
    }

    query += ` ORDER BY ${orderByColumn} ${order === 'asc' ? 'ASC' : 'DESC'}`;

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT b.id)
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
    `;

    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      books: result.rows,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBook = async (req, res) => {
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Get book details with author and genres
    const bookResult = await db.query(
      `
      SELECT b.*, a.name as author_name, a.id as author_id, a.image_url as author_image,
             array_agg(DISTINCT g.name) as genres
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE b.id = $1
      GROUP BY b.id, a.id
    `,
      [id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is in user's favorites
    let isFavorite = false;

    if (req.user) {
      const favoriteResult = await db.query(
        'SELECT * FROM user_favorite_books WHERE user_id = $1 AND book_id = $2',
        [req.user.id, id]
      );

      isFavorite = favoriteResult.rows.length > 0;
    }

    // Get reading status if user is logged in
    let readingStatus = null;

    if (req.user) {
      const statusResult = await db.query(
        'SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2',
        [req.user.id, id]
      );

      if (statusResult.rows.length > 0) {
        readingStatus = statusResult.rows[0];
      }
    }

    // Get top reviews
    const reviewsResult = await db.query(
      `
      SELECT r.*, u.name as user_name, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
      LIMIT 5
    `,
      [id]
    );

    res.json({
      ...bookResult.rows[0],
      isFavorite,
      readingStatus,
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToFavorites = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Check if book exists
    const bookResult = await db.query('SELECT * FROM books WHERE id = $1', [
      id,
    ]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already in favorites
    const favoriteResult = await db.query(
      'SELECT * FROM user_favorite_books WHERE user_id = $1 AND book_id = $2',
      [userId, id]
    );

    if (favoriteResult.rows.length > 0) {
      return res.status(400).json({ message: 'Book is already in favorites' });
    }

    // Add to favorites
    await db.query(
      'INSERT INTO user_favorite_books (user_id, book_id) VALUES ($1, $2)',
      [userId, id]
    );

    res.status(201).json({ message: 'Book added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Remove from favorites
    const result = await db.query(
      'DELETE FROM user_favorite_books WHERE user_id = $1 AND book_id = $2',
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Book is not in favorites' });
    }

    res.json({ message: 'Book removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFavoriteBooks = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT b.*, a.name as author_name, ufb.created_at as added_at
      FROM user_favorite_books ufb
      JOIN books b ON ufb.book_id = b.id
      JOIN authors a ON b.author_id = a.id
      WHERE ufb.user_id = $1
      ORDER BY ufb.created_at DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
