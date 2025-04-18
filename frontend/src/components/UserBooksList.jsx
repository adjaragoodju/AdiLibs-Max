import React from 'react';
import { Link } from 'react-router-dom';
import { userBookService } from '../services/api';

const statusLabels = {
  want_to_read: 'Want to Read',
  reading: 'Currently Reading',
  completed: 'Completed',
  did_not_finish: 'Did Not Finish',
};

const UserBooksList = ({ books, status }) => {
  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await userBookService.updateUserBook(bookId, { status: newStatus });
      // You would typically update state here or refetch data
      // For simplicity, we're just reloading the page
      window.location.reload();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (books.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500 mb-4'>
          {status === 'want_to_read'
            ? "You haven't added any books to your reading list yet."
            : status === 'reading'
            ? "You're not currently reading any books."
            : "You haven't completed any books yet."}
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

  return (
    <div className='space-y-6'>
      {books.map((book) => (
        <div
          key={book.id}
          className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors'
        >
          <div className='md:w-1/6'>
            <Link to={`/books/${book.book_id}`}>
              <img
                src={book.image_url || '/placeholder-book.jpg'}
                alt={book.title}
                className='w-full h-40 object-cover rounded'
              />
            </Link>
          </div>
          <div className='md:w-5/6'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
              <div>
                <Link
                  to={`/books/${book.book_id}`}
                  className='text-xl font-bold hover:text-blue-600 transition-colors'
                >
                  {book.title}
                </Link>
                <p className='text-gray-600'>{book.author_name}</p>
                <div className='flex items-center mt-2 space-x-2'>
                  <span className='px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full'>
                    {book.genres?.join(', ')}
                  </span>
                </div>
              </div>
              <div className='mt-4 md:mt-0'>
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(book.id, e.target.value)}
                  className='px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {status === 'reading' && (
              <div className='mt-4'>
                <div className='bg-gray-200 h-2 rounded-full overflow-hidden'>
                  <div
                    className='bg-blue-600 h-full'
                    style={{
                      width: `${
                        book.current_page && book.pages
                          ? Math.min(
                              100,
                              (book.current_page / book.pages) * 100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className='flex justify-between mt-1 text-sm text-gray-600'>
                  <span>Page {book.current_page || 0}</span>
                  <span>of {book.pages || '?'}</span>
                </div>
              </div>
            )}

            {status === 'completed' && (
              <div className='mt-4 text-sm text-gray-600'>
                <p>Started: {formatDate(book.start_date)}</p>
                <p>Finished: {formatDate(book.finish_date)}</p>
              </div>
            )}

            {book.notes && (
              <div className='mt-3 text-gray-700'>
                <p className='italic'>"{book.notes}"</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBooksList;
