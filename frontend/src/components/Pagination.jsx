import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Create array of page numbers to display
  if (totalPages <= 7) {
    // If 7 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always include first and last page
    pageNumbers.push(1);

    // If current page is among the first 3 pages
    if (currentPage <= 3) {
      pageNumbers.push(2, 3, 4, '...', totalPages);
    }
    // If current page is among the last 3 pages
    else if (currentPage >= totalPages - 2) {
      pageNumbers.push(
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    }
    // If current page is somewhere in the middle
    else {
      pageNumbers.push(
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }
  }

  return (
    <div className='flex justify-center mt-8'>
      <nav className='flex space-x-2'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-black text-white'
                : page === '...'
                ? 'text-gray-500 cursor-default'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
