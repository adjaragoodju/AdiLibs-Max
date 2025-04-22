// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
      <h1 className='text-6xl font-bold text-blue-600 mb-4'>404</h1>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>Page Not Found</h2>
      <p className='text-lg text-gray-600 max-w-md mb-8'>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className='space-x-4'>
        <Link
          to='/'
          className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'
        >
          Go to Homepage
        </Link>
        <Link
          to='/books'
          className='bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors'
        >
          Browse Books
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
