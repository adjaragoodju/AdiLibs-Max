// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-800 text-white pt-10 pb-6 mt-16'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo and Description */}
          <div className='md:col-span-2'>
            <Link to='/' className='text-2xl font-bold'>
              AdiLibs
            </Link>
            <p className='mt-2 text-gray-300'>
              Track your reading, discover new books, and connect with a
              community of book lovers.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className='text-lg font-semibold mb-3'>Navigation</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/books'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  to='/authors'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Authors
                </Link>
              </li>
              <li>
                <Link
                  to='/my-books'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className='text-lg font-semibold mb-3'>Account</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/login'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to='/register'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to='/profile'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to='/favorites'
                  className='text-gray-300 hover:text-white transition duration-150'
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 pt-6 border-t border-gray-700'>
          <p className='text-center text-gray-400'>
            &copy; {currentYear} AdiLibs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
