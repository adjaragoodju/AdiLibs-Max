// controllers/reviews.controller.js
exports.getBookReviews = async (req, res) => {
  const { bookId } = req.params;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT r.*, u.name as user_name, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
    `,
      [bookId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserReviews = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT r.*, b.title, b.image_url, a.name as author_name
      FROM reviews r
      JOIN books b ON r.book_id = b.id
      JOIN authors a ON b.author_id = a.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  const { rating, content } = req.body;
  const db = req.app.get('db');

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if book exists
    const bookResult = await db.query('SELECT * FROM books WHERE id = $1', [
      bookId,
    ]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReviewResult = await db.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    if (existingReviewResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this book' });
    }

    // Add review
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Add review
      const reviewResult = await client.query(
        `INSERT INTO reviews (user_id, book_id, rating, content)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, bookId, rating, content]
      );

      // Update book rating
      await client.query(
        `UPDATE books 
         SET average_rating = (
           SELECT AVG(rating) FROM reviews WHERE book_id = $1
         ),
         rating_count = (
           SELECT COUNT(*) FROM reviews WHERE book_id = $1
         )
         WHERE id = $1`,
        [bookId]
      );

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Review added successfully',
        review: reviewResult.rows[0],
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { rating, content } = req.body;
  const db = req.app.get('db');

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if review exists and belongs to user
    const reviewResult = await db.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const bookId = reviewResult.rows[0].book_id;
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Update review
      const updatedReviewResult = await client.query(
        `UPDATE reviews 
         SET rating = COALESCE($1, rating), 
             content = COALESCE($2, content),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [rating, content, id]
      );

      // Update book rating
      await client.query(
        `UPDATE books 
         SET average_rating = (
           SELECT AVG(rating) FROM reviews WHERE book_id = $1
         )
         WHERE id = $1`,
        [bookId]
      );

      await client.query('COMMIT');

      res.json({
        message: 'Review updated successfully',
        review: updatedReviewResult.rows[0],
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const db = req.app.get('db');

  try {
    // Check if review exists and belongs to user
    const reviewResult = await db.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const bookId = reviewResult.rows[0].book_id;
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Delete review
      await client.query('DELETE FROM reviews WHERE id = $1', [id]);

      // Update book rating
      await client.query(
        `UPDATE books 
         SET average_rating = (
           SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE book_id = $1
         ),
         rating_count = (
           SELECT COUNT(*) FROM reviews WHERE book_id = $1
         )
         WHERE id = $1`,
        [bookId]
      );

      await client.query('COMMIT');

      res.json({ message: 'Review deleted successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
