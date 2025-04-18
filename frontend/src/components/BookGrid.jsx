import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// BookCard component (extracted for better reusability and memoization)
const BookCard = memo(({ book }) => {
  const {
    id,
    title,
    author_name,
    image_url,
    average_rating,
    rating_count,
    genres,
    year,
  } = book;

  return (
    <Link to={`/books/${id}`} className='group'>
      <div className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform group-hover:shadow-md group-hover:-translate-y-1 h-full flex flex-col'>
        <div className='h-64 bg-gray-200 relative overflow-hidden'>
          <img
            src={image_url || '/placeholder-book.jpg'}
            alt={title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            onError={(e) => {
              e.target.src = '/placeholder-book.jpg';
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
            <div className='p-4 text-white'>
              <p className='font-medium'>View Details</p>
            </div>
          </div>
        </div>
        <div className='p-4 flex flex-col flex-grow'>
          <h3 className='font-bold text-gray-900 line-clamp-1'>{title}</h3>
          <p className='text-gray-600 text-sm'>by {author_name}</p>
          <div className='flex items-center mt-2'>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 20 20'
                  fill={
                    star <= Math.round(average_rating || 0)
                      ? '#000000'
                      : '#D1D5DB'
                  }
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <span className='text-xs text-gray-500 ml-1'>
              ({rating_count || 0})
            </span>
          </div>
          <div className='mt-auto pt-2'>
            <span className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full'>
              {genres && Array.isArray(genres) && genres.length > 0
                ? genres[0]
                : year}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

BookCard.displayName = 'BookCard';

// Main BookGrid component
const BookGrid = ({
  books,
  loading = false,
  emptyMessage = 'No books found',
}) => {
  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
        {[...Array(8)].map((_, index) => (
          <div key={index} className='animate-pulse'>
            <div className='bg-gray-200 h-64 rounded-lg mb-2'></div>
            <div className='bg-gray-200 h-4 w-3/4 rounded mb-2'></div>
            <div className='bg-gray-200 h-3 w-1/2 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className='text-center py-16 bg-gray-50 rounded-lg'>
        <p className='text-gray-500'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

BookGrid.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      author_name: PropTypes.string.isRequired,
      image_url: PropTypes.string,
      average_rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      rating_count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      genres: PropTypes.array,
      year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export default memo(BookGrid);
