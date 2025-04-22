// src/pages/BookDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import BookCard from '../components/books/BookCard';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import ReadingStatusSelector from '../components/books/ReadingStatusSelector';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book details and similar books
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch book details
        const bookResponse = await api.get(`/books/${id}`);
        setBook(bookResponse.data);

        // Fetch similar books
        const similarResponse = await api.get(`/recommendations/similar/${id}`);
        setSimilarBooks(similarResponse.data);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    try {
      if (book.isFavorite) {
        await api.delete(`/books/${id}/favorites`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/books/${id}/favorites`);
        toast.success('Added to favorites');
      }

      // Update book state
      setBook({
        ...book,
        isFavorite: !book.isFavorite,
      });
    } catch (err) {
      toast.error('Failed to update favorites');
      console.error('Error updating favorites:', err);
    }
  };

  // Update reading status
  const handleReadingStatusChange = async (status, currentPage = 0) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    try {
      // If already in library, update status
      if (book.readingStatus) {
        await api.put(`/user-books/${book.readingStatus.id}`, {
          status,
          currentPage,
        });
        toast.success(`Book marked as "${status.replace('_', ' ')}"`);
      } else {
        // If not in library, add it
        await api.post('/user-books', {
          bookId: book.id,
          status,
          currentPage,
        });
        toast.success(
          `Book added to your library as "${status.replace('_', ' ')}"`
        );
      }

      // Refresh book details to get updated reading status
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (err) {
      toast.error('Failed to update reading status');
      console.error('Error updating reading status:', err);
    }
  };

  // Add or update review
  const handleReviewSubmit = async (reviewData) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    try {
      await api.post(`/books/${id}/reviews`, reviewData);
      toast.success('Review submitted successfully');

      // Refresh book details to show the new review
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (err) {
      toast.error('Failed to submit review');
      console.error('Error submitting review:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className='text-center py-8'>
        <h3 className='text-xl font-medium'>Book not found</h3>
        <p className='text-gray-600 mt-2'>
          The book you're looking for might have been removed or doesn't exist.
        </p>
        <Link
          to='/books'
          className='text-blue-600 hover:underline mt-4 inline-block'
        >
          Browse all books
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-12'>
      {/* Book Details */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Book Cover */}
          <div className='md:col-span-1'>
            <div className='relative aspect-[2/3] max-w-xs mx-auto'>
              <img
                src={book.image_url || '/placeholder-book.png'}
                alt={book.title}
                className='w-full h-full object-cover rounded-lg shadow-md'
              />

              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 rounded-full p-2 shadow-md ${
                  book.isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600'
                }`}
                title={
                  book.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill={book.isFavorite ? 'currentColor' : 'none'}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={book.isFavorite ? 0 : 2}
                    d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                  />
                </svg>
              </button>
            </div>

            {/* Reading Status */}
            <div className='mt-6'>
              <ReadingStatusSelector
                currentStatus={book.readingStatus?.status || null}
                onStatusChange={handleReadingStatusChange}
              />
            </div>
          </div>

          {/* Book Info */}
          <div className='md:col-span-2'>
            <h1 className='text-3xl font-bold text-gray-800'>{book.title}</h1>
            <p className='text-xl text-gray-600 mt-1'>
              by{' '}
              <Link
                to={`/authors/${book.author_id}`}
                className='text-blue-600 hover:underline'
              >
                {book.author_name}
              </Link>
            </p>

            {/* Rating */}
            <div className='flex items-center mt-3'>
              <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill={
                      star <= Math.round(book.average_rating)
                        ? 'currentColor'
                        : 'none'
                    }
                    stroke='currentColor'
                    className={`w-5 h-5 ${
                      star <= Math.round(book.average_rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={
                        star <= Math.round(book.average_rating) ? 0 : 2
                      }
                      d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
                    />
                  </svg>
                ))}
              </div>
              <span className='ml-2 text-gray-600'>
                {book.average_rating.toFixed(1)} ({book.rating_count} ratings)
              </span>
            </div>

            {/* Book Details */}
            <div className='grid grid-cols-2 gap-4 mt-6'>
              {book.year && (
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Published
                  </h3>
                  <p className='mt-1'>{book.year}</p>
                </div>
              )}
              {book.pages && (
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Pages</h3>
                  <p className='mt-1'>{book.pages}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Language
                  </h3>
                  <p className='mt-1'>{book.language}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>ISBN</h3>
                  <p className='mt-1'>{book.isbn}</p>
                </div>
              )}
            </div>

            {/* Genres */}
            {book.genres && book.genres.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-sm font-medium text-gray-500'>Genres</h3>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {book.genres.map((genre, index) => (
                    <Link
                      key={index}
                      to={`/books?genre=${encodeURIComponent(genre)}`}
                      className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors'
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div className='mt-6'>
                <h3 className='text-sm font-medium text-gray-500'>
                  Description
                </h3>
                <p className='mt-2 text-gray-700 whitespace-pre-line'>
                  {book.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold mb-6'>Reviews</h2>

        {/* Add Review */}
        {isAuthenticated &&
          !book.reviews?.some(
            (review) => review.user_id === book.review_user_id
          ) && (
            <div className='mb-8'>
              <h3 className='text-lg font-semibold mb-4'>Write a Review</h3>
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          )}

        {/* Review List */}
        {book.reviews && book.reviews.length > 0 ? (
          <ReviewList reviews={book.reviews} />
        ) : (
          <p className='text-gray-500 italic'>
            No reviews yet. Be the first to review this book!
          </p>
        )}

        {/* View More Reviews Link */}
        {book.reviews &&
          book.reviews.length > 0 &&
          book.reviews.length < book.rating_count && (
            <div className='mt-6 text-center'>
              <Link
                to={`/books/${id}/reviews`}
                className='text-blue-600 hover:underline font-medium'
              >
                View all {book.rating_count} reviews
              </Link>
            </div>
          )}
      </div>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <div>
          <h2 className='text-2xl font-bold mb-6'>Similar Books</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {similarBooks.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
