import React from 'react';
import Book from '../books/Book';

const SearchResults = ({
  searchQuery,
  searchResults,
  setShowSearchResults,
  handleBookClick,
}) => {
  return (
    <section className='container mx-auto px-4 my-16'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-3xl font-bold'>
          Search Results for "{searchQuery}"
        </h2>
        <button
          onClick={() => setShowSearchResults(false)}
          className='text-black hover:text-gray-700'
        >
          Clear Results
        </button>
      </div>

      {searchResults.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {searchResults.map((book, index) => (
            <div
              key={index}
              onClick={() => handleBookClick(book)}
              className='cursor-pointer transition-transform hover:scale-105'
            >
              <Book
                title={book.title}
                author={book.author}
                year={book.year}
                image={book.image || '/placeholder-book.jpg'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-16 w-16 mx-auto text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='mt-4 text-xl font-medium'>No books found</h3>
          <p className='text-gray-500'>
            Try a different search term or browse our categories
          </p>
        </div>
      )}
    </section>
  );
};

export default SearchResults;
