// src/components/books/BookListItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BookListItem = ({
  book,
  onStatusChange,
  onUpdateProgress,
  onRemoveBook,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(book.current_page || 0);

  const statuses = [
    { id: 'want_to_read', label: 'Want to Read' },
    { id: 'reading', label: 'Currently Reading' },
    { id: 'completed', label: 'Completed' },
    { id: 'did_not_finish', label: 'Did Not Finish' },
  ];

  const handleStatusChange = (newStatus) => {
    onStatusChange(book.id, newStatus);
    setShowStatusDropdown(false);
  };

  const handleProgressUpdate = (e) => {
    e.preventDefault();
    onUpdateProgress(book.id, parseInt(currentPage));
    setShowProgressModal(false);
  };

  const handleRemove = () => {
    if (
      window.confirm(
        'Are you sure you want to remove this book from your library?'
      )
    ) {
      onRemoveBook(book.id);
    }
  };

  const statusLabel =
    statuses.find((s) => s.id === book.status)?.label || 'Unknown';
  const progressPercentage = book.pages
    ? (book.current_page / book.pages) * 100
    : 0;

  return (
    <li className='py-4'>
      <div className='flex items-start space-x-4'>
        {/* Book Cover */}
        <Link to={`/books/${book.book_id}`} className='flex-shrink-0'>
          <img
            src={book.image_url || '/placeholder-book.png'}
            alt={book.title}
            className='w-20 h-28 object-cover rounded shadow-md'
          />
        </Link>

        {/* Book Info */}
        <div className='flex-1 min-w-0'>
          <Link to={`/books/${book.book_id}`} className='hover:underline'>
            <h3 className='text-lg font-medium text-gray-900 truncate'>
              {book.title}
            </h3>
          </Link>
          <p className='text-sm text-gray-500'>
            by{' '}
            <Link to={`/authors/${book.author_id}`} className='hover:underline'>
              {book.author_name}
            </Link>
          </p>

          {/* Status and Progress */}
          <div className='mt-2 flex flex-wrap gap-2 items-center'>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                book.status === 'reading'
                  ? 'bg-green-100 text-green-800'
                  : book.status === 'completed'
                  ? 'bg-purple-100 text-purple-800'
                  : book.status === 'want_to_read'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {statusLabel}
            </span>

            {book.status === 'reading' && book.pages && (
              <span className='text-xs text-gray-500'>
                {book.current_page} of {book.pages} pages (
                {Math.round(progressPercentage)}%)
              </span>
            )}

            {book.start_date && (
              <span className='text-xs text-gray-500'>
                Started: {new Date(book.start_date).toLocaleDateString()}
              </span>
            )}

            {book.finish_date && (
              <span className='text-xs text-gray-500'>
                Finished: {new Date(book.finish_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Progress Bar for Reading Status */}
          {book.status === 'reading' && book.pages && (
            <div className='mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
              <div
                className='bg-blue-600 h-2.5 rounded-full'
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              ></div>
            </div>
          )}

          {/* Notes */}
          {book.notes && (
            <div className='mt-2'>
              <p className='text-sm text-gray-600 italic'>{book.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex-shrink-0 flex flex-col space-y-2'>
          {/* Reading Status Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Change Status
            </button>
            {showStatusDropdown && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      book.status === status.id
                        ? 'bg-gray-100 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
                <div className='border-t border-gray-200 my-1'></div>
                <button
                  onClick={handleRemove}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                >
                  Remove from Library
                </button>
              </div>
            )}
          </div>

          {/* Update Progress Button (Only for reading status) */}
          {book.status === 'reading' && (
            <button
              onClick={() => setShowProgressModal(true)}
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Update Progress
            </button>
          )}

          {/* View Book Link */}
          <Link
            to={`/books/${book.book_id}`}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            View Book
          </Link>
        </div>
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && (
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-xl p-6 w-96 max-w-full'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Update Reading Progress
            </h3>
            <form onSubmit={handleProgressUpdate}>
              <div className='mb-4'>
                <label
                  htmlFor='currentPage'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Current Page
                </label>
                <input
                  type='number'
                  id='currentPage'
                  min='0'
                  max={book.pages || 9999}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {book.pages && (
                  <p className='mt-1 text-sm text-gray-500'>
                    {book.pages} pages total
                  </p>
                )}
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => setShowProgressModal(false)}
                  className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </li>
  );
};

BookListItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    book_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author_name: PropTypes.string.isRequired,
    author_id: PropTypes.number,
    image_url: PropTypes.string,
    status: PropTypes.string.isRequired,
    current_page: PropTypes.number,
    pages: PropTypes.number,
    notes: PropTypes.string,
    start_date: PropTypes.string,
    finish_date: PropTypes.string,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onUpdateProgress: PropTypes.func.isRequired,
  onRemoveBook: PropTypes.func.isRequired,
};

export default BookListItem;
