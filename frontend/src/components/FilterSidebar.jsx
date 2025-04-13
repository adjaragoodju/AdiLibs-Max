import React, { useState, useEffect } from 'react';

// This would typically come from an API
const genres = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Horror',
  'Biography',
  'Self-Development',
  'History',
  'Fiction',
  'Thriller',
];

const FilterSidebar = ({ genre, sort, order, onFilterChange }) => {
  const [selectedGenre, setSelectedGenre] = useState(genre);

  useEffect(() => {
    setSelectedGenre(genre);
  }, [genre]);

  const handleGenreChange = (genreValue) => {
    setSelectedGenre(genreValue);
    onFilterChange('genre', genreValue);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      <h3 className='text-lg font-bold mb-4'>Filters</h3>

      <div className='mb-6'>
        <h4 className='font-medium mb-3'>Genres</h4>
        <div className='space-y-2'>
          <div className='flex items-center'>
            <input
              id='all-genres'
              type='radio'
              name='genre'
              checked={!selectedGenre}
              onChange={() => handleGenreChange('')}
              className='h-4 w-4 text-black focus:ring-black border-gray-300'
            />
            <label htmlFor='all-genres' className='ml-2 text-gray-700'>
              All Genres
            </label>
          </div>

          {genres.map((genreItem) => (
            <div key={genreItem} className='flex items-center'>
              <input
                id={`genre-${genreItem}`}
                type='radio'
                name='genre'
                checked={selectedGenre === genreItem}
                onChange={() => handleGenreChange(genreItem)}
                className='h-4 w-4 text-black focus:ring-black border-gray-300'
              />
              <label
                htmlFor={`genre-${genreItem}`}
                className='ml-2 text-gray-700'
              >
                {genreItem}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className='border-t pt-6'>
        <button
          onClick={() => {
            setSelectedGenre('');
            onFilterChange('genre', '');
            onFilterChange('sort', 'rating');
            onFilterChange('order', 'desc');
          }}
          className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors'
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
