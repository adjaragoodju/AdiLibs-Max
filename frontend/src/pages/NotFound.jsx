// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className='container mx-auto px-4 py-24 text-center'>
        <h1 className='text-9xl font-bold text-gray-200'>404</h1>
        <h2 className='text-3xl font-bold mb-4'>Page Not Found</h2>
        <p className='text-gray-600 mb-8'>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to='/'
          className='inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors'
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
