// src/components/reviews/ReviewList.jsx
import React from 'react';
import PropTypes from 'prop-types';

export const ReviewList = ({ reviews }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {reviews.map((review) => (
        <div
          key={review.id}
          className='border-b border-gray-200 pb-6 last:border-b-0'
        >
          <div className='flex items-start'>
            {/* User Avatar */}
            <div className='mr-4'>
              <img
                src={review.avatar_url || '/default-avatar.png'}
                alt={review.user_name}
                className='w-10 h-10 rounded-full object-cover'
              />
            </div>

            {/* Review Content */}
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h4 className='font-medium text-gray-800'>
                  {review.user_name}
                </h4>
                <span className='text-sm text-gray-500'>
                  {formatDate(review.created_at)}
                </span>
              </div>

              {/* Rating Stars */}
              <div className='flex items-center mt-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill={star <= review.rating ? 'currentColor' : 'none'}
                    stroke='currentColor'
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={star <= review.rating ? 0 : 2}
                      d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
                    />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className='mt-2 text-gray-700 whitespace-pre-line'>
                {review.content}
              </p>

              {/* If updated, show edited timestamp */}
              {review.updated_at && review.updated_at !== review.created_at && (
                <p className='mt-1 text-xs text-gray-500 italic'>
                  Edited on {formatDate(review.updated_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      user_name: PropTypes.string.isRequired,
      avatar_url: PropTypes.string,
      rating: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string,
    })
  ).isRequired,
};

export default ReviewList;
