import React from 'react';

const AuthorCard = ({ name, image, genre, description, onClick }) => {
  return (
    <div
      className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer'
      onClick={onClick}
    >
      <div className='h-64 bg-gray-200 relative overflow-hidden group'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
          onError={(e) => {
            e.target.src = '/writer.jpg'; // Fallback image
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
          <div className='p-4 text-white'>
            <p className='font-medium'>View Books</p>
          </div>
        </div>
      </div>
      <div className='p-6'>
        <h3 className='text-xl font-bold mb-2'>{name}</h3>
        <div className='px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium inline-block mb-3'>
          {genre}
        </div>
        <p className='text-gray-600 line-clamp-3'>{description}</p>
      </div>
    </div>
  );
};

export default AuthorCard;
