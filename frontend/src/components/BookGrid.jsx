import React from 'react';
import { Link } from 'react-router-dom';

const BookGrid = ({ books }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
      {books.map((book) => (
        <Link key={book.id} to={`/books/${book.id}`} className='group'>
          <div className='bg-white rounded-lg shadow-sm overflow-hidden transition-transform group-hover:shadow-md group-hover:-translate-y-1'>
            <div className='h-64 bg-gray-200 relative overflow-hidden'>
              <img
                src={book.image_url || '/placeholder-book.jpg'}
                alt={book.title}
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
            <div className='p-4'>
              <h3 className='font-bold text-gray-900 line-clamp-1'>
                {book.title}
              </h3>
              <p className='text-gray-600 text-sm'>by {book.author_name}</p>
              <div className='flex items-center mt-2'>
                <div className='flex'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
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
                <span className='text-xs text-gray-500 ml-1'>
                  ({book.rating_count})
                </span>
              </div>
              <div className='mt-2'>
                <span className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full'>
                  {book.genres && Array.isArray(book.genres)
                    ? book.genres[0]
                    : book.year}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookGrid;
