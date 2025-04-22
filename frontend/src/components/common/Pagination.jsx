// src/components/common/Pagination.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination for one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate range of pages to show
  const getPageRange = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max to show, display all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page, last page, current page, and pages adjacent to current
    const pages = [1];

    // Calculate start and end of middle section
    let middleStart = Math.max(2, currentPage - 1);
    let middleEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adjust to always show 3 pages in middle when possible
    if (middleEnd - middleStart + 1 < 3 && totalPages > 4) {
      if (currentPage <= 3) {
        // Near start, show 2, 3, 4
        middleStart = 2;
        middleEnd = 4;
      } else if (currentPage >= totalPages - 2) {
        // Near end, show last-3, last-2, last-1
        middleStart = totalPages - 3;
        middleEnd = totalPages - 1;
      }
    }

    // Add ellipsis before middle section if needed
    if (middleStart > 2) {
      pages.push('...');
    }

    // Add middle section
    for (let i = middleStart; i <= middleEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis after middle section if needed
    if (middleEnd < totalPages - 1) {
      pages.push('...');
    }

    // Add last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageRange();

  return (
    <div className='flex justify-center'>
      <nav
        className='inline-flex rounded-md shadow-sm -space-x-px'
        aria-label='Pagination'
      >
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className='sr-only'>Previous</span>
          <svg
            className='h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() =>
              typeof pageNumber === 'number' && onPageChange(pageNumber)
            }
            disabled={pageNumber === '...' || pageNumber === currentPage}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              pageNumber === currentPage
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : pageNumber === '...'
                ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className='sr-only'>Next</span>
          <svg
            className='h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
