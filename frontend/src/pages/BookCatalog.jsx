import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/api';
import BookGrid from './BookGrid';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';

const BookCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1');
  const genre = searchParams.get('genre') || '';
  const author = searchParams.get('author') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'rating';
  const order = searchParams.get('order') || 'desc';

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await bookService.getBooks({
          page,
          genre,
          author,
          search,
          sort,
          order,
        });

        setBooks(response.data.books);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, genre, author, search, sort, order]);

  const handleFilter = (filterKey, value) => {
    searchParams.set('page', '1');

    if (value) {
      searchParams.set(filterKey, value);
    } else {
      searchParams.delete(filterKey);
    }

    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Book Catalog</h1>

      <div className='flex flex-col lg:flex-row gap-8'>
        <aside className='lg:w-1/4'>
          <FilterSidebar
            genre={genre}
            sort={sort}
            order={order}
            onFilterChange={handleFilter}
          />
        </aside>

        <main className='lg:w-3/4'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {search ? `Search results for "${search}"` : 'All Books'}
              {genre && ` in ${genre}`}
            </h2>

            <div className='flex items-center space-x-2'>
              <label htmlFor='sort' className='text-sm text-gray-600'>
                Sort by:
              </label>
              <select
                id='sort'
                value={sort}
                onChange={(e) => handleFilter('sort', e.target.value)}
                className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='rating'>Rating</option>
                <option value='title'>Title</option>
                <option value='author'>Author</option>
                <option value='year'>Year</option>
              </select>

              <select
                value={order}
                onChange={(e) => handleFilter('order', e.target.value)}
                className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='desc'>Descending</option>
                <option value='asc'>Ascending</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
            </div>
          ) : books.length === 0 ? (
            <div className='text-center py-16 bg-gray-50 rounded-lg'>
              <h3 className='text-xl font-medium mb-2'>No books found</h3>
              <p className='text-gray-500 mb-6'>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => setSearchParams({})}
                className='bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors'
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <BookGrid books={books} />

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookCatalog;
