// src/components/books/BookFilters.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BookFilters = ({
  genres,
  selectedGenre,
  sortBy,
  sortOrder,
  onFilterChange,
  onSearch,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    // Sort options are stored as "field:order"
    const [field, order] = value.split(':');
    onFilterChange('sort', field);
    onFilterChange('order', order);
  };

  const handleGenreChange = (e) => {
    onFilterChange('genre', e.target.value);
  };

  // Create current sort value for select
  const currentSortValue = `${sortBy}:${sortOrder}`;

  return (
    <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
      <h2 className='text-xl font-bold mb-4'>Filters</h2>

      {/* Search */}
      <div className='mb-6'>
        <label
          htmlFor='search'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Search Books
        </label>
        <form onSubmit={handleSearchSubmit} className='flex'>
          <input
            type='text'
            id='search'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder='Title or author'
            className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Genre Filter */}
      <div className='mb-6'>
        <label
          htmlFor='genre'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Genre
        </label>
        <select
          id='genre'
          value={selectedGenre}
          onChange={handleGenreChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value=''>All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label
          htmlFor='sort'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Sort By
        </label>
        <select
          id='sort'
          value={currentSortValue}
          onChange={handleSortChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        >
          <option value='rating:desc'>Highest Rated</option>
          <option value='rating:asc'>Lowest Rated</option>
          <option value='title:asc'>Title (A-Z)</option>
          <option value='title:desc'>Title (Z-A)</option>
          <option value='year:desc'>Newest First</option>
          <option value='year:asc'>Oldest First</option>
          <option value='author:asc'>Author (A-Z)</option>
          <option value='author:desc'>Author (Z-A)</option>
        </select>
      </div>

      {/* Reset Filters Button */}
      {(selectedGenre ||
        initialSearchQuery ||
        sortBy !== 'rating' ||
        sortOrder !== 'desc') && (
        <div className='mt-6'>
          <button
            onClick={() => {
              onFilterChange('genre', '');
              onFilterChange('sort', 'rating');
              onFilterChange('order', 'desc');
              onSearch('');
              setSearchQuery('');
            }}
            className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

BookFilters.propTypes = {
  genres: PropTypes.array.isRequired,
  selectedGenre: PropTypes.string,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  initialSearchQuery: PropTypes.string,
};

export default BookFilters;
