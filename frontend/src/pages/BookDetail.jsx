import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  bookService,
  userBookService,
  recommendationService,
  reviewService,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';
import BookGrid from './BookGrid';
import ReviewsList from './ReviewsList';
import WriteReviewForm from './WriteReviewForm';
import ReadingProgressTracker from './ReadingProgressTracker';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [readingStatus, setReadingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await bookService.getBook(id);
        setBook(bookResponse.data);

        // Set reading status if available
        if (bookResponse.data.readingStatus) {
          setReadingStatus(bookResponse.data.readingStatus);
        }

        // Fetch similar books
        const similarBooksResponse =
          await recommendationService.getSimilarBooks(id);
        setSimilarBooks(similarBooksResponse.data);

        // Fetch reviews
        const reviewsResponse = await reviewService.getBookReviews(id);
        setReviews(reviewsResponse.data);

        // Check if user has reviewed this book
        if (user) {
          const userReviewObj = reviewsResponse.data.find(
            (review) => review.user_id === user.id
          );
          setUserReview(userReviewObj || null);
        }
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError('Failed to load book data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, user]);

  const handleAddToLibrary = async (status) => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/books/${id}`;
      return;
    }

    try {
      const response = await userBookService.addUserBook({
        bookId: id,
        status: status,
      });

      setReadingStatus(response.data.userBook);
    } catch (err) {
      console.error('Error adding book to library:', err);
    }
  };

  const handleUpdateReadingStatus = async (status) => {
    try {
      const response = await userBookService.updateUserBook(readingStatus.id, {
        status: status,
      });

      setReadingStatus(response.data.userBook);
    } catch (err) {
      console.error('Error updating reading status:', err);
    }
  };

  const handleUpdateProgress = async (currentPage) => {
    try {
      const response = await userBookService.updateReadingProgress(
        readingStatus.id,
        {
          currentPage: currentPage,
        }
      );

      setReadingStatus(response.data.userBook);
    } catch (err) {
      console.error('Error updating reading progress:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/books/${id}`;
      return;
    }

    try {
      if (book.isFavorite) {
        await bookService.removeFromFavorites(id);
      } else {
        await bookService.addToFavorites(id);
      }

      // Update book state with new favorite status
      setBook({
        ...book,
        isFavorite: !book.isFavorite,
      });
    } catch (err) {
      console.error('Error toggling favorite status:', err);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await reviewService.addReview(id, reviewData);
      setUserReview(response.data.review);

      // Update reviews list
      const updatedReviews = [response.data.review, ...reviews];
      setReviews(updatedReviews);

      // Update book rating
      setBook({
        ...book,
        average_rating: parseFloat(
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length
        ).toFixed(1),
        rating_count: updatedReviews.length,
      });
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-6 py-16 flex justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className='container mx-auto px-6 py-16 text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Error</h2>
        <p className='text-gray-600 mb-8'>{error || 'Book not found'}</p>
        <Link
          to='/books'
          className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800'
        >
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-6 py-12'>
      <div className='flex flex-col lg:flex-row gap-12 mb-12'>
        {/* Book Cover and Actions */}
        <div className='lg:w-1/3'>
          <div className='bg-white rounded-lg shadow-md overflow-hidden mb-6'>
            <img
              src={book.image_url || '/placeholder-book.jpg'}
              alt={book.title}
              className='w-full h-auto'
            />
          </div>

          <div className='space-y-4'>
            {!readingStatus ? (
              <div className='grid grid-cols-2 gap-4'>
                <button
                  onClick={() => handleAddToLibrary('want_to_read')}
                  className='bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors w-full'
                >
                  Want to Read
                </button>
                <button
                  onClick={() => handleAddToLibrary('reading')}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors w-full'
                >
                  Start Reading
                </button>
              </div>
            ) : (
              <ReadingProgressTracker
                readingStatus={readingStatus}
                bookPages={book.pages}
                onStatusChange={handleUpdateReadingStatus}
                onProgressUpdate={handleUpdateProgress}
              />
            )}

            <button
              onClick={handleToggleFavorite}
              className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-colors ${
                book.isFavorite
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'border border-gray-300 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                fill={book.isFavorite ? 'currentColor' : 'none'}
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
              {book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>

          {/* Book Details */}
          <div className='mt-8 bg-gray-50 rounded-lg p-6'>
            <h3 className='text-lg font-bold mb-4'>Book Details</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Published:</span>
                <span>{book.year}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Pages:</span>
                <span>{book.pages || 'Unknown'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Language:</span>
                <span>{book.language || 'English'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>ISBN:</span>
                <span>{book.isbn || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Info and Reviews */}
        <div className='lg:w-2/3'>
          <h1 className='text-4xl font-bold mb-2'>{book.title}</h1>

          <div className='flex items-center mb-4'>
            <Link
              to={`/authors/${book.author_id}`}
              className='text-xl text-blue-600 hover:underline'
            >
              {book.author_name}
            </Link>
          </div>

          {/* Rating */}
          <div className='flex items-center mb-6'>
            <div className='flex mr-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  viewBox='0 0 20 20'
                  fill={
                    star <= Math.round(book.average_rating)
                      ? '#000000'
                      : '#D1D5DB'
                  }
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <span className='text-xl font-bold'>{book.average_rating}</span>
            <span className='text-gray-600 ml-2'>
              ({book.rating_count} ratings)
            </span>
          </div>

          {/* Genres */}
          <div className='mb-8'>
            {book.genres &&
              book.genres.map((genre, index) => (
                <Link
                  key={index}
                  to={`/books?genre=${genre}`}
                  className='inline-block mr-2 mb-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors text-sm'
                >
                  {genre}
                </Link>
              ))}
          </div>

          {/* Description */}
          <div className='mb-10'>
            <h2 className='text-2xl font-bold mb-4'>About the Book</h2>
            <p className='text-gray-700 leading-relaxed'>
              {book.description ||
                `No description available for ${book.title}.`}
            </p>
          </div>

          {/* Reviews Section */}
          <div className='mt-12'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>Reviews</h2>
              {user && !userReview && (
                <button
                  onClick={() =>
                    document
                      .getElementById('write-review')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  className='text-blue-600 hover:underline'
                >
                  Write a review
                </button>
              )}
            </div>

            {reviews.length > 0 ? (
              <ReviewsList reviews={reviews} />
            ) : (
              <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-gray-500 mb-4'>No reviews yet</p>
                {user && (
                  <button
                    onClick={() =>
                      document
                        .getElementById('write-review')
                        .scrollIntoView({ behavior: 'smooth' })
                    }
                    className='bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors'
                  >
                    Be the first to review
                  </button>
                )}
              </div>
            )}

            {user && !userReview && (
              <div id='write-review' className='mt-12'>
                <h3 className='text-xl font-bold mb-4'>Write a Review</h3>
                <WriteReviewForm onSubmit={handleReviewSubmit} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Books Section */}
      {similarBooks.length > 0 && (
        <div className='mt-16'>
          <h2 className='text-2xl font-bold mb-6'>Similar Books</h2>
          <BookGrid books={similarBooks} />
        </div>
      )}
    </div>
  );
};

export default BookDetail;
