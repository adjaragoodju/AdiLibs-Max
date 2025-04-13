// controllers/userBooks.controller.js
exports.getUserBooks = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT ub.*, b.title, b.image_url, b.year, a.name as author_name, 
             array_agg(DISTINCT g.name) as genres
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE ub.user_id = $1
      GROUP BY ub.id, b.id, a.id
      ORDER BY ub.updated_at DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBooksByStatus = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.params;
  const db = req.app.get('db');

  try {
    const result = await db.query(
      `
      SELECT ub.*, b.title, b.image_url, b.year, a.name as author_name, 
             array_agg(DISTINCT g.name) as genres
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE ub.user_id = $1 AND ub.status = $2
      GROUP BY ub.id, b.id, a.id
      ORDER BY ub.updated_at DESC
    `,
      [userId, status]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addUserBook = async (req, res) => {
  const userId = req.user.id;
  const { bookId, status, currentPage } = req.body;
  const db = req.app.get('db');

  try {
    // Check if book exists
    const bookResult = await db.query('SELECT * FROM books WHERE id = $1', [
      bookId,
    ]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already has this book
    const userBookResult = await db.query(
      'SELECT * FROM user_books WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );

    if (userBookResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'This book is already in your library' });
    }

    // Set dates based on status
    let startDate = null;
    let finishDate = null;

    if (status === 'reading') {
      startDate = new Date();
    } else if (status === 'completed') {
      startDate = startDate || new Date();
      finishDate = new Date();
    }

    // Add book to user's library
    const result = await db.query(
      `INSERT INTO user_books 
       (user_id, book_id, status, current_page, start_date, finish_date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, bookId, status, currentPage, startDate, finishDate]
    );

    res.status(201).json({
      message: 'Book added to your library',
      userBook: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserBook = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status, currentPage, notes } = req.body;
  const db = req.app.get('db');

  try {
    // Check if user book exists
    const userBookResult = await db.query(
      'SELECT * FROM user_books WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (userBookResult.rows.length === 0) {
      return res.status(404).json({ message: 'User book not found' });
    }

    const userBook = userBookResult.rows[0];

    // Determine dates based on status change
    let startDate = userBook.start_date;
    let finishDate = userBook.finish_date;

    if (status === 'reading' && userBook.status !== 'reading' && !startDate) {
      startDate = new Date();
    } else if (status === 'completed' && userBook.status !== 'completed') {
      finishDate = new Date();
    }

    // Update user book
    const result = await db.query(
      `UPDATE user_books 
       SET status = COALESCE($1, status), 
           current_page = COALESCE($2, current_page), 
           notes = COALESCE($3, notes),
           start_date = COALESCE($4, start_date),
           finish_date = COALESCE($5, finish_date)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [status, currentPage, notes, startDate, finishDate, id, userId]
    );

    res.json({
      message: 'Reading status updated',
      userBook: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReadingProgress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { currentPage } = req.body;
  const db = req.app.get('db');

  try {
    // Check if user book exists
    const userBookResult = await db.query(
      'SELECT ub.*, b.pages FROM user_books ub JOIN books b ON ub.book_id = b.id WHERE ub.id = $1 AND ub.user_id = $2',
      [id, userId]
    );

    if (userBookResult.rows.length === 0) {
      return res.status(404).json({ message: 'User book not found' });
    }

    const userBook = userBookResult.rows[0];
    let status = userBook.status;
    let startDate = userBook.start_date;
    let finishDate = userBook.finish_date;

    // If book is not in reading status, update it
    if (status !== 'reading') {
      status = 'reading';
      if (!startDate) {
        startDate = new Date();
      }
    }

    // Check if book is completed
    if (userBook.pages && currentPage >= userBook.pages) {
      status = 'completed';
      finishDate = new Date();
    }

    // Update reading progress
    const result = await db.query(
      `UPDATE user_books 
       SET current_page = $1, 
           status = $2,
           start_date = COALESCE($3, start_date),
           finish_date = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [currentPage, status, startDate, finishDate, id, userId]
    );

    res.json({
      message: 'Reading progress updated',
      userBook: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReadingStats = async (req, res) => {
  const userId = req.user.id;
  const db = req.app.get('db');

  try {
    // Get counts by status
    const statusCountsResult = await db.query(
      `SELECT status, COUNT(*) 
       FROM user_books 
       WHERE user_id = $1 
       GROUP BY status`,
      [userId]
    );

    // Calculate total pages read
    const pagesReadResult = await db.query(
      `SELECT SUM(ub.current_page) as total_pages_read
       FROM user_books ub
       WHERE ub.user_id = $1`,
      [userId]
    );

    // Get books completed per month in current year
    const currentYear = new Date().getFullYear();
    const booksPerMonthResult = await db.query(
      `SELECT EXTRACT(MONTH FROM finish_date) as month, COUNT(*) 
       FROM user_books 
       WHERE user_id = $1 
         AND status = 'completed' 
         AND EXTRACT(YEAR FROM finish_date) = $2
       GROUP BY month 
       ORDER BY month`,
      [userId, currentYear]
    );

    // Format status counts
    const statusCounts = {};
    statusCountsResult.rows.forEach((row) => {
      statusCounts[row.status] = parseInt(row.count);
    });

    res.json({
      statusCounts,
      totalPagesRead: parseInt(pagesReadResult.rows[0]?.total_pages_read || 0),
      booksPerMonth: booksPerMonthResult.rows.map((row) => ({
        month: parseInt(row.month),
        count: parseInt(row.count),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
