import React from 'react';

const ReviewCard = ({ name, avatar, rating, text, date, onClick }) => {
  return (
    <div
      className='bg-gray-800 p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer'
      onClick={onClick}
    >
      <div className='flex items-center mb-4'>
        <img
          src={avatar || '/placeholder-avatar.jpg.avif'}
          alt={name}
          className='w-12 h-12 rounded-full object-cover mr-4'
          onError={(e) => {
            e.target.src = '/placeholder-avatar.jpg.avif'; // Fallback image
          }}
        />
        <div>
          <h3 className='font-bold'>{name}</h3>
          <span className='text-gray-400 text-sm'>{date}</span>
        </div>
      </div>

      <div className='flex mb-4'>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill={star <= rating ? '#FBBF24' : '#4B5563'}
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>

      <p className='text-gray-300 line-clamp-3'>{text}</p>

      <div className='mt-4 text-sm text-gray-400 flex items-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-4 w-4 mr-1'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <span>Click to read full review</span>
      </div>
    </div>
  );
};

export default ReviewCard;
