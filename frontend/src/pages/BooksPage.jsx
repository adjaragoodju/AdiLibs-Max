// src/pages/BooksPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/books/BookCard';
import BookFilters from '../components/books/BookFilters';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values from URL or use defaults
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const sortBy = searchParams.get('sort') || 'rating';
  const sortOrder = searchParams.get('order') || 'desc';

  // In BooksPage.jsx
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Your existing books fetch code

        // Extract unique genres from books
        if (response.data.books && response.data.books.length > 0) {
          const uniqueGenres = [];
          response.data.books.forEach((book) => {
            if (book.genres) {
              book.genres.forEach((genre) => {
                if (!uniqueGenres.some((g) => g.name === genre)) {
                  uniqueGenres.push({
                    id: uniqueGenres.length + 1,
                    name: genre,
                  });
                }
              });
            }
          });
          setGenres(uniqueGenres);
        }
      } catch (err) {
        // Existing error handling
      }
    };

    fetchBooks();
  }, [
    currentPage,
    searchQuery,
    selectedGenre,
    sortBy,
    sortOrder,
    pagination.limit,
  ]);

  // Fetch genres once on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data);
      } catch (err) {
        console.error('Error fetching genres:', err);
        // Not setting error state here as books are the primary data
      }
    };

    fetchGenres();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    // Reset to page 1 when filters change (except for page change)
    if (filterName !== 'page') {
      searchParams.set('page', '1');
    }

    if (value) {
      searchParams.set(filterName, value);
    } else {
      searchParams.delete(filterName);
    }

    setSearchParams(searchParams);
  };

  // Handle search submit
  const handleSearch = (query) => {
    handleFilterChange('search', query);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage.toString());
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
      {/* Sidebar Filters */}
      <div className='lg:col-span-1'>
        <BookFilters
          genres={genres}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* Book Grid */}
      <div className='lg:col-span-3'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold'>
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Browse Books'}
          </h1>
          {selectedGenre && (
            <p className='text-gray-600'>Genre: {selectedGenre}</p>
          )}

          {/* Results count */}
          {!loading && (
            <p className='text-gray-600 mt-2'>
              {pagination.total} {pagination.total === 1 ? 'book' : 'books'}{' '}
              found
            </p>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className='text-center py-8'>
            <h3 className='text-xl font-medium'>No books found</h3>
            <p className='text-gray-600 mt-2'>
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
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
    </div>
  );
};

export default BooksPage;
