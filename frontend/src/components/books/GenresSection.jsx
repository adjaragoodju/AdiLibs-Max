import React from 'react';
import Book from './Book';

const GenresSection = ({
  genresRef,
  uniqueGenres,
  selectedGenre,
  setSelectedGenre,
  getBooksByFilter,
  handleBookClick,
}) => {
  // Define color schemes and icons for each genre
  const genreStyles = {
    Fantasy: {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
          />
        </svg>
      ),
      bgSelected: 'bg-purple-800',
      bgUnselected: 'bg-purple-100',
      textSelected: 'text-white',
      textUnselected: 'text-purple-800',
      hoverBg: 'hover:bg-purple-200',
    },
    Mystery: {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
      ),
      bgSelected: 'bg-blue-800',
      bgUnselected: 'bg-blue-100',
      textSelected: 'text-white',
      textUnselected: 'text-blue-800',
      hoverBg: 'hover:bg-blue-200',
    },
    Romance: {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
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
      ),
      bgSelected: 'bg-red-800',
      bgUnselected: 'bg-red-100',
      textSelected: 'text-white',
      textUnselected: 'text-red-800',
      hoverBg: 'hover:bg-red-200',
    },
    Horror: {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      bgSelected: 'bg-gray-800',
      bgUnselected: 'bg-gray-100',
      textSelected: 'text-white',
      textUnselected: 'text-gray-800',
      hoverBg: 'hover:bg-gray-200',
    },
    'Science Fiction': {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
      ),
      bgSelected: 'bg-cyan-800',
      bgUnselected: 'bg-cyan-100',
      textSelected: 'text-white',
      textUnselected: 'text-cyan-800',
      hoverBg: 'hover:bg-cyan-200',
    },
    Biography: {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      ),
      bgSelected: 'bg-amber-800',
      bgUnselected: 'bg-amber-100',
      textSelected: 'text-white',
      textUnselected: 'text-amber-800',
      hoverBg: 'hover:bg-amber-200',
    },
    'Self-Development': {
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 mb-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
          />
        </svg>
      ),
      bgSelected: 'bg-green-800',
      bgUnselected: 'bg-green-100',
      textSelected: 'text-white',
      textUnselected: 'text-green-800',
      hoverBg: 'hover:bg-green-200',
    },
  };

  // Default style for any genre not in our list
  const defaultStyle = {
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-6 w-6 mb-2'
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
    ),
    bgSelected: 'bg-black',
    bgUnselected: 'bg-gray-100',
    textSelected: 'text-white',
    textUnselected: 'text-gray-800',
    hoverBg: 'hover:bg-gray-200',
  };

  return (
    <section
      id='genres'
      ref={genresRef}
      className='container mx-auto px-6 my-20'
    >
      <div className='text-sm tracking-widest text-gray-700 uppercase mb-2'>
        CATEGORIES
      </div>
      <h2 className='text-4xl font-bold mb-10'>Explore by Genre</h2>

      {/* Genre Selection Grid - With Icons and Colors */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-10'>
        {uniqueGenres.map((genreItem) => {
          const style = genreStyles[genreItem] || defaultStyle;
          const isSelected = selectedGenre === genreItem;

          return (
            <button
              key={genreItem}
              onClick={() => setSelectedGenre(genreItem)}
              className={`
                p-6 rounded-lg text-center flex flex-col items-center justify-center shadow-sm transform transition-all duration-200 hover:-translate-y-1
                ${
                  isSelected
                    ? `${style.bgSelected} ${style.textSelected} shadow-lg scale-105`
                    : `${style.bgUnselected} ${style.hoverBg} ${style.textUnselected}`
                }
              `}
            >
              {style.icon}
              <span className='font-medium'>{genreItem}</span>
            </button>
          );
        })}
      </div>

      {/* Filtered Books Section */}
      {selectedGenre && (
        <div className='mt-8 bg-gray-50 p-8 rounded-xl shadow-inner'>
          <h3 className='text-2xl font-bold mb-8 flex items-center'>
            <span className='mr-3'>{selectedGenre} Books</span>
            <div className='h-1 w-16 bg-black rounded'></div>
          </h3>

          {/* Исправленная сетка для карточек книг */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {getBooksByFilter('genre', selectedGenre).map((book, index) => (
              <div
                key={index}
                onClick={() => handleBookClick(book)}
                className='cursor-pointer bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 h-full flex flex-col'
              >
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='w-full h-48 mb-3 overflow-hidden flex items-center justify-center'>
                    <img
                      src={book.image || '/placeholder-book.jpg'}
                      alt={book.title}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  <div className='flex flex-col flex-grow'>
                    <h4 className='font-medium text-lg leading-tight mb-1 line-clamp-2'>
                      {book.title}
                    </h4>
                    <p className='text-sm text-gray-600 mb-1'>{book.author}</p>
                    <p className='text-xs text-gray-500'>{book.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default GenresSection;
