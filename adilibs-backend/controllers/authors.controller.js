// controllers/authors.controller.js
exports.getAuthors = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (page - 1) * limit;
  const db = req.app.get('db');

  try {
    let query = `
      SELECT a.*, COUNT(b.id) as book_count
      FROM authors a
      LEFT JOIN books b ON a.id = b.author_id
    `;

    const queryParams = [];

    if (search) {
      query += ` WHERE a.name ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    query += `
      GROUP BY a.id
      ORDER BY a.name
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM authors';

    if (search) {
      countQuery += ' WHERE name ILIKE $1';
    }

    const countResult = await db.query(
      countQuery,
      search ? [`%${search}%`] : []
    );

    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      authors: result.rows,
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

exports.getAuthor = async (req, res) => {
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    const authorResult = await db.query('SELECT * FROM authors WHERE id = $1', [
      id,
    ]);

    if (authorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Get author's books
    const booksResult = await db.query(
      `
      SELECT b.*, array_agg(g.name) as genres
      FROM books b
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE b.author_id = $1
      GROUP BY b.id
      ORDER BY b.year DESC
    `,
      [id]
    );

    // Check if user is following author
    let isFollowing = false;

    if (req.user) {
      const followResult = await db.query(
        'SELECT * FROM user_author_follows WHERE user_id = $1 AND author_id = $2',
        [req.user.id, id]
      );

      isFollowing = followResult.rows.length > 0;
    }

    // Get follower count
    const followersResult = await db.query(
      'SELECT COUNT(*) FROM user_author_follows WHERE author_id = $1',
      [id]
    );

    res.json({
      ...authorResult.rows[0],
      books: booksResult.rows,
      isFollowing,
      followerCount: parseInt(followersResult.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.followAuthor = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Check if author exists
    const authorResult = await db.query('SELECT * FROM authors WHERE id = $1', [
      id,
    ]);

    if (authorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Check if already following
    const followResult = await db.query(
      'SELECT * FROM user_author_follows WHERE user_id = $1 AND author_id = $2',
      [userId, id]
    );

    if (followResult.rows.length > 0) {
      return res.status(400).json({ message: 'Already following this author' });
    }

    // Add follow
    await db.query(
      'INSERT INTO user_author_follows (user_id, author_id) VALUES ($1, $2)',
      [userId, id]
    );

    res.status(201).json({ message: 'Author followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowAuthor = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Remove follow
    const result = await db.query(
      'DELETE FROM user_author_follows WHERE user_id = $1 AND author_id = $2',
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'You are not following this author' });
    }

    res.json({ message: 'Author unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFollowedAuthors = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT a.*, COUNT(b.id) as book_count
      FROM user_author_follows uaf
      JOIN authors a ON uaf.author_id = a.id
      LEFT JOIN books b ON a.id = b.author_id
      WHERE uaf.user_id = $1
      GROUP BY a.id
      ORDER BY a.name
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
