// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/books/favorites');
        setFavorites(response.data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}/favorites`);

      // Update state to remove book
      setFavorites(favorites.filter((book) => book.id !== bookId));

      toast.success('Book removed from favorites');
    } catch (err) {
      toast.error('Failed to remove from favorites');
      console.error('Error removing from favorites:', err);
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

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <h1 className='text-3xl font-bold'>My Favorites</h1>
        <Link
          to='/books'
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          Browse Books
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
          <h2 className='text-xl font-medium text-gray-600'>
            No favorite books yet
          </h2>
          <p className='text-gray-500 mt-2'>
            Books you add to your favorites will appear here.
          </p>
          <Link
            to='/books'
            className='mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
          >
            Find books to favorite
          </Link>
        </div>
      ) : (
        <div>
          <p className='text-gray-600 mb-6'>
            You have {favorites.length}{' '}
            {favorites.length === 1 ? 'book' : 'books'} in your favorites.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {favorites.map((book) => (
              <div key={book.id} className='relative'>
                <BookCard book={book} />
                <button
                  onClick={() => handleRemoveFromFavorites(book.id)}
                  className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors'
                  title='Remove from favorites'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-5 h-5'
                  >
                    <path d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
