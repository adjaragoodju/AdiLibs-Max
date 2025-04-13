import React, { useState } from 'react';
import Modal from '../layout/Modal';
import { useFavorites } from '../../context/FavoritesContext';

const AuthorQuote = () => {
  const [showBookModal, setShowBookModal] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const bookData = {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    year: '1943',
    genre: 'Fantasy',
    image: '/little-prince.webp',
    description:
      'The Little Prince is a poetic tale about a pilot stranded in the desert who meets a young prince visiting Earth from his home asteroid. Through their conversations, the story addresses themes of loneliness, friendship, love, and loss. The Little Prince is philosophical in nature and includes social criticism, remarking on the strangeness of the adult world.',
    rating: 5,
    ratingCount: '5238',
    pages: '96',
    language: 'English',
  };

  // Проверяем, находится ли книга в избранном
  const isBookInFavorites = favorites.some(
    (book) => book.title === bookData.title && book.author === bookData.author
  );

  // Обработчик добавления/удаления из избранного
  const handleFavoritesToggle = () => {
    if (isBookInFavorites) {
      removeFromFavorites(bookData);
    } else {
      addToFavorites(bookData);
    }
  };

  return (
    <section className='relative my-20'>
      {/* Background Image */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: 'url("/antonio.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Black Overlay */}
      <div className='absolute inset-0 bg-black opacity-70 z-10' />

      {/* Content */}
      <div className='container mx-auto px-6 py-24 relative z-20'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='md:w-1/2'>
            <div className='text-8xl text-white font-serif mb-4'>"</div>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              A goal without a plan is just a wish.
            </h2>
            <p className='text-xl text-white mb-8'>
              - Antoine de Saint-Exupéry
            </p>
            <button
              onClick={() => setShowBookModal(true)}
              className='inline-block bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg text-lg font-medium transition-colors'
            >
              Read The Little Prince
            </button>
          </div>

          <div className='md:w-1/3'>
            <button
              onClick={() => setShowBookModal(true)}
              className='block transform transition-transform hover:scale-105 w-full cursor-pointer'
            >
              <img
                src='/little-prince.webp'
                alt='The Little Prince by Antoine de Saint-Exupéry'
                className='w-full shadow-2xl rounded-lg'
              />
            </button>
          </div>
        </div>
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <Modal onClose={() => setShowBookModal(false)}>
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='md:w-1/3'>
              <img
                src={bookData.image}
                alt={bookData.title}
                className='w-full h-auto object-cover rounded-lg shadow-lg'
              />

              {/* Book Details */}
              <div className='mt-6 space-y-3'>
                <div className='flex items-center'>
                  <span className='text-gray-500'>Published:</span>
                  <span className='ml-auto'>{bookData.year}</span>
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-500'>Genre:</span>
                  <span className='ml-auto'>{bookData.genre}</span>
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-500'>Pages:</span>
                  <span className='ml-auto'>{bookData.pages}</span>
                </div>
                <div className='flex items-center'>
                  <span className='text-gray-500'>Language:</span>
                  <span className='ml-auto'>{bookData.language}</span>
                </div>
              </div>
            </div>
            <div className='md:w-2/3'>
              <h2 className='text-3xl font-bold mb-2'>{bookData.title}</h2>
              <p className='text-xl text-gray-600 mb-4'>by {bookData.author}</p>

              {/* Rating */}
              <div className='flex items-center mb-6'>
                <div className='flex'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill={star <= bookData.rating ? '#000000' : '#D1D5DB'}
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='text-gray-600 ml-2'>
                  {bookData.ratingCount} reviews
                </span>
              </div>

              <div className='mb-6'>
                <span className='text-sm bg-gray-100 text-gray-700 inline-block px-3 py-1 rounded-full'>
                  {bookData.genre}
                </span>
              </div>

              <div className='mb-8'>
                <h3 className='text-xl font-semibold mb-3'>About the Book</h3>
                <p className='text-gray-700 leading-relaxed'>
                  {bookData.description}
                </p>
              </div>

              <div className='flex flex-wrap gap-4'>
                <button
                  onClick={handleFavoritesToggle}
                  className={`${
                    isBookInFavorites
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-black hover:bg-gray-800'
                  } text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center`}
                  aria-label={
                    isBookInFavorites
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2'
                    fill={isBookInFavorites ? 'currentColor' : 'none'}
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
                  {isBookInFavorites
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </button>
                <button className='border border-black text-black hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors font-medium flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                  Read
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default AuthorQuote;
