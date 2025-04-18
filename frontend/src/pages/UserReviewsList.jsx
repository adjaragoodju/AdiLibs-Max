// frontend/src/pages/UserReviewsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserReviewsList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500 mb-4'>
          You haven't written any reviews yet.
        </p>
        <Link
          to='/books'
          className='inline-block bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors'
        >
          Explore Books
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
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
          className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0 mr-4'>
              <Link to={`/books/${review.book_id}`}>
                <img
                  src={review.image_url || '/placeholder-book.jpg'}
                  alt={review.title}
                  className='w-16 h-24 object-cover rounded shadow'
                />
              </Link>
            </div>

            <div className='flex-grow'>
              <div className='flex justify-between items-start'>
                <div>
                  <Link
                    to={`/books/${review.book_id}`}
                    className='text-lg font-semibold hover:text-blue-600 transition-colors'
                  >
                    {review.title}
                  </Link>
                  <p className='text-sm text-gray-600'>
                    by {review.author_name}
                  </p>
                </div>

                <div className='flex items-center'>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 20 20'
                        fill={star <= review.rating ? '#000000' : '#D1D5DB'}
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <p className='mt-3 text-gray-700'>{review.content}</p>

              <div className='mt-2 flex justify-between items-center'>
                <span className='text-xs text-gray-500'>
                  {formatDate(review.created_at)}
                </span>

                <div className='flex space-x-2'>
                  <button
                    className='text-sm text-blue-600 hover:text-blue-800'
                    onClick={() => {
                      // Edit functionality would go here
                      console.log('Edit review', review.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className='text-sm text-red-600 hover:text-red-800'
                    onClick={() => {
                      // Delete functionality would go here
                      console.log('Delete review', review.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserReviewsList;
