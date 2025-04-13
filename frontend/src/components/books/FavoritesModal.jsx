import React from 'react';
import Modal from '../layout/Modal';
import { useFavorites } from '../../context/FavoritesContext';

const FavoritesModal = ({
  setShowFavoritesModal,
  setSelectedBook,
  scrollToSection,
  genresRef,
}) => {
  const { favorites, removeFromFavorites } = useFavorites();

  // Функция для просмотра деталей книги
  const handleViewBookDetails = (book) => {
    setSelectedBook(book);
    setShowFavoritesModal(false);
  };

  return (
    <Modal onClose={() => setShowFavoritesModal(false)}>
      <div>
        <h2 className='text-3xl font-bold mb-6'>Your Favorites</h2>

        {favorites.length > 0 ? (
          <div className='space-y-4'>
            {favorites.map((book, index) => (
              <div
                key={index}
                className='flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors'
              >
                {/* Обложка книги - кликабельная */}
                <div
                  className='cursor-pointer'
                  onClick={() => handleViewBookDetails(book)}
                >
                  <img
                    src={book.image || '/placeholder-book.jpg'}
                    alt={book.title}
                    className='w-16 h-24 object-cover rounded hover:opacity-90 transition-opacity'
                  />
                </div>

                {/* Информация о книге - кликабельная */}
                <div
                  className='flex-grow px-4 cursor-pointer'
                  onClick={() => handleViewBookDetails(book)}
                >
                  <h3 className='font-medium text-lg hover:text-blue-600 transition-colors'>
                    {book.title}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {book.author} - {book.year}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>{book.genre}</p>
                </div>

                {/* Кнопка удаления из избранного (увеличенная) */}
                <button
                  className='text-red-500 hover:text-red-700 p-2 flex items-center transition-colors'
                  onClick={() => removeFromFavorites(book)}
                  aria-label='Remove from favorites'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6' /* Увеличенный размер */
                    fill='currentColor'
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
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 bg-gray-50 rounded-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 mx-auto text-gray-400'
              fill='none'
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
            <p className='mt-4 text-xl font-medium'>No favorites yet</p>
            <p className='text-gray-500 mb-8'>
              Start exploring books to add to your favorites
            </p>
            <button
              onClick={() => {
                setShowFavoritesModal(false);
                scrollToSection(genresRef);
              }}
              className='bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors font-medium'
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FavoritesModal;
