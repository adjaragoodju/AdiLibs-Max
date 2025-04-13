import React from 'react';

const Book = ({ title, author, year, image }) => {
  return (
    <div className='min-w-[240px] flex-shrink-0'>
      <div className='h-[308px] w-full bg-gray-200 rounded-lg overflow-hidden shadow-md relative group'>
        {image && (
          <img
            src={image}
            alt={title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4'>
          <div className='text-white'>
            <p className='font-medium'>View Details</p>
          </div>
        </div>
      </div>
      <div className='mt-3'>
        <h3 className='text-lg font-semibold line-clamp-1'>{title}</h3>
        <p className='text-gray-600'>
          {author}
          <span className='mx-2'>•</span>
          <span className='text-gray-500'>{year}</span>
        </p>
      </div>
    </div>
  );
};

export default Book;
