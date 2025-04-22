// src/pages/AuthorsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: pagination.limit,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await api.get('/authors', { params });

        setAuthors(response.data.authors);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Error fetching authors:', err);
        setError('Failed to load authors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [currentPage, searchQuery, pagination.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');

    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }

    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <h1 className='text-3xl font-bold'>Authors</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className='flex'>
          <input
            type='text'
            name='search'
            defaultValue={searchQuery}
            placeholder='Search authors...'
            className='px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      ) : authors.length === 0 ? (
        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
          <h2 className='text-xl font-medium text-gray-600'>
            No authors found
          </h2>
          {searchQuery && (
            <p className='text-gray-500 mt-2'>
              No authors match your search "{searchQuery}".
            </p>
          )}
          <Link
            to='/authors'
            className='mt-4 inline-block text-blue-600 hover:underline'
          >
            View all authors
          </Link>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {authors.map((author) => (
              <Link
                key={author.id}
                to={`/authors/${author.id}`}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
              >
                <div className='aspect-square overflow-hidden'>
                  <img
                    src={author.image_url || '/placeholder-author.png'}
                    alt={author.name}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    {author.name}
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    {author.book_count}{' '}
                    {author.book_count === 1 ? 'book' : 'books'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className='mt-8'>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorsPage;
