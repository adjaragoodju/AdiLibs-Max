// src/pages/MyBooksPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { toast } from 'react-toastify';
import api from '../services/api';
import BookListItem from '../components/books/BookListItem';
import ReadingStats from '../components/books/ReadingStats';
import LoadingSpinner from '../components/common/LoadingSpinner';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MyBooksPage = () => {
  const [userBooks, setUserBooks] = useState({
    all: [],
    want_to_read: [],
    reading: [],
    completed: [],
    did_not_finish: [],
  });
  const [readingStats, setReadingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all user books
        const booksResponse = await api.get('/user-books');

        // Group books by status
        const allBooks = booksResponse.data;
        const groupedBooks = {
          all: allBooks,
          want_to_read: allBooks.filter(
            (book) => book.status === 'want_to_read'
          ),
          reading: allBooks.filter((book) => book.status === 'reading'),
          completed: allBooks.filter((book) => book.status === 'completed'),
          did_not_finish: allBooks.filter(
            (book) => book.status === 'did_not_finish'
          ),
        };

        setUserBooks(groupedBooks);

        // Fetch reading stats
        const statsResponse = await api.get('/user-books/stats');
        setReadingStats(statsResponse.data);
      } catch (err) {
        console.error('Error fetching user books:', err);
        setError('Failed to load your books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const handleStatusChange = async (bookId, newStatus, currentPage = 0) => {
    try {
      await api.put(`/user-books/${bookId}`, {
        status: newStatus,
        currentPage,
      });

      toast.success(`Book updated to "${newStatus.replace('_', ' ')}"`);

      // Refresh user books
      const response = await api.get('/user-books');
      const allBooks = response.data;

      setUserBooks({
        all: allBooks,
        want_to_read: allBooks.filter((book) => book.status === 'want_to_read'),
        reading: allBooks.filter((book) => book.status === 'reading'),
        completed: allBooks.filter((book) => book.status === 'completed'),
        did_not_finish: allBooks.filter(
          (book) => book.status === 'did_not_finish'
        ),
      });

      // Refresh reading stats
      const statsResponse = await api.get('/user-books/stats');
      setReadingStats(statsResponse.data);
    } catch (err) {
      toast.error('Failed to update book status');
      console.error('Error updating book status:', err);
    }
  };

  const handleUpdateProgress = async (bookId, currentPage) => {
    try {
      await api.patch(`/user-books/${bookId}/reading-progress`, {
        currentPage,
      });

      toast.success('Reading progress updated');

      // Refresh user books
      const response = await api.get('/user-books');
      const allBooks = response.data;

      setUserBooks({
        all: allBooks,
        want_to_read: allBooks.filter((book) => book.status === 'want_to_read'),
        reading: allBooks.filter((book) => book.status === 'reading'),
        completed: allBooks.filter((book) => book.status === 'completed'),
        did_not_finish: allBooks.filter(
          (book) => book.status === 'did_not_finish'
        ),
      });

      // Refresh reading stats
      const statsResponse = await api.get('/user-books/stats');
      setReadingStats(statsResponse.data);
    } catch (err) {
      toast.error('Failed to update reading progress');
      console.error('Error updating reading progress:', err);
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await api.delete(`/user-books/${bookId}`);

      toast.success('Book removed from your library');

      // Remove book from state
      const updatedBooks = userBooks.all.filter((book) => book.id !== bookId);

      setUserBooks({
        all: updatedBooks,
        want_to_read: updatedBooks.filter(
          (book) => book.status === 'want_to_read'
        ),
        reading: updatedBooks.filter((book) => book.status === 'reading'),
        completed: updatedBooks.filter((book) => book.status === 'completed'),
        did_not_finish: updatedBooks.filter(
          (book) => book.status === 'did_not_finish'
        ),
      });

      // Refresh reading stats
      const statsResponse = await api.get('/user-books/stats');
      setReadingStats(statsResponse.data);
    } catch (err) {
      toast.error('Failed to remove book');
      console.error('Error removing book:', err);
    }
  };

  // Tabs configuration
  const tabs = [
    { key: 'all', label: 'All Books' },
    { key: 'reading', label: 'Currently Reading' },
    { key: 'want_to_read', label: 'Want to Read' },
    { key: 'completed', label: 'Completed' },
    { key: 'did_not_finish', label: 'Did Not Finish' },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <h1 className='text-3xl font-bold'>My Library</h1>
        <Link
          to='/books'
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
        >
          Browse Books
        </Link>
      </div>

      {/* Reading Statistics */}
      {readingStats && <ReadingStats stats={readingStats} />}

      {/* Tabs for different book statuses */}
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-blue-100 p-1'>
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              {tab.label} ({userBooks[tab.key].length})
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-2'>
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.key}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {userBooks[tab.key].length === 0 ? (
                <div className='text-center py-8'>
                  <h3 className='text-xl font-medium text-gray-600'>
                    No books in this category
                  </h3>
                  <p className='text-gray-500 mt-2'>
                    {tab.key === 'all'
                      ? "You haven't added any books to your library yet."
                      : `You don't have any books marked as "${tab.label}".`}
                  </p>
                  <Link
                    to='/books'
                    className='mt-4 inline-block text-blue-600 hover:underline'
                  >
                    Browse books to add to your library
                  </Link>
                </div>
              ) : (
                <ul className='divide-y divide-gray-200'>
                  {userBooks[tab.key].map((book) => (
                    <BookListItem
                      key={book.id}
                      book={book}
                      onStatusChange={handleStatusChange}
                      onUpdateProgress={handleUpdateProgress}
                      onRemoveBook={handleRemoveBook}
                    />
                  ))}
                </ul>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MyBooksPage;
