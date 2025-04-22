// src/components/books/BookCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <Link to={`/books/${book.id}`}>
        <div className='relative h-56 overflow-hidden'>
          <img
            src={book.image_url || '/placeholder-book.png'}
            alt={book.title}
            className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
          />
          {book.average_rating > 0 && (
            <div className='absolute top-2 right-2 bg-yellow-400 text-black font-bold rounded-full h-10 w-10 flex items-center justify-center'>
              {book.average_rating.toFixed(1)}
            </div>
          )}
        </div>
        <div className='p-4'>
          <h3 className='font-bold text-lg text-gray-800 line-clamp-1'>
            {book.title}
          </h3>
          <p className='text-gray-600'>{book.author_name}</p>
          {book.genres && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {book.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'
                >
                  {genre}
                </span>
              ))}
              {book.genres.length > 2 && (
                <span className='inline-block text-xs text-gray-500'>
                  +{book.genres.length - 2} more
                </span>
              )}
            </div>
          )}
          {book.year && (
            <p className='text-gray-500 text-sm mt-2'>Published: {book.year}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    author_name: PropTypes.string.isRequired,
    average_rating: PropTypes.number,
    genres: PropTypes.array,
    year: PropTypes.string,
  }).isRequired,
};

export default BookCard;
