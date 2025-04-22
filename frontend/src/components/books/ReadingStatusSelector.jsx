// src/components/books/ReadingStatusSelector.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReadingStatusSelector = ({ currentStatus, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statuses = [
    { id: 'want_to_read', label: 'Want to Read' },
    { id: 'reading', label: 'Currently Reading' },
    { id: 'completed', label: 'Completed' },
    { id: 'did_not_finish', label: 'Did Not Finish' },
  ];

  const getStatusLabel = (statusId) => {
    return statuses.find((s) => s.id === statusId)?.label || 'Add to Library';
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatusSelect = (status) => {
    if (status === 'reading') {
      // For reading status, we'll ask for current page
      setSelectedStatus(status);
    } else {
      // For other statuses, directly update
      onStatusChange(status);
      setShowDropdown(false);
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    onStatusChange(selectedStatus, Number(pageInput) || 0);
    setSelectedStatus(null);
    setPageInput('');
    setShowDropdown(false);
  };

  const buttonColor = currentStatus
    ? {
        want_to_read: 'bg-blue-600 hover:bg-blue-700',
        reading: 'bg-green-600 hover:bg-green-700',
        completed: 'bg-purple-600 hover:bg-purple-700',
        did_not_finish: 'bg-gray-600 hover:bg-gray-700',
      }[currentStatus]
    : 'bg-blue-600 hover:bg-blue-700';

  if (selectedStatus === 'reading') {
    return (
      <div className='w-full'>
        <form onSubmit={handlePageSubmit} className='space-y-3'>
          <p className='font-medium text-gray-700'>Enter current page:</p>
          <input
            type='number'
            min='0'
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Page number'
            autoFocus
          />
          <div className='flex space-x-2'>
            <button
              type='submit'
              className='flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              Save
            </button>
            <button
              type='button'
              onClick={() => setSelectedStatus(null)}
              className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <button
        type='button'
        onClick={toggleDropdown}
        className={`w-full ${buttonColor} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center`}
      >
        <span className='mr-1'>
          {currentStatus ? getStatusLabel(currentStatus) : 'Add to Library'}
        </span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='w-5 h-5'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className='absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg py-1'>
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => handleStatusSelect(status.id)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                currentStatus === status.id ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {status.label}
            </button>
          ))}

          {/* Remove option if book is already in library */}
          {currentStatus && (
            <>
              <div className='border-t border-gray-200 my-1'></div>
              <button
                onClick={() => onStatusChange(null)}
                className='w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'
              >
                Remove from Library
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

ReadingStatusSelector.propTypes = {
  currentStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
};

export default ReadingStatusSelector;
