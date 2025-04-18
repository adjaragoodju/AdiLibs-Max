// frontend/src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className='bg-white shadow-md'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between h-16'>
          {/* Logo and main nav links */}
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <Logo />
            </Link>

            {/* Desktop navigation */}
            <div className='hidden md:ml-8 md:flex md:space-x-6'>
              <Link
                to='/books'
                className='px-3 py-2 text-gray-700 hover:text-black'
              >
                Books
              </Link>
              <Link
                to='/authors'
                className='px-3 py-2 text-gray-700 hover:text-black'
              >
                Authors
              </Link>
              {isAuthenticated && (
                <Link
                  to='/profile'
                  className='px-3 py-2 text-gray-700 hover:text-black'
                >
                  My Library
                </Link>
              )}
            </div>
          </div>

          {/* Right side - search, auth buttons, etc */}
          <div className='flex items-center'>
            {/* Desktop search */}
            <div className='hidden md:block'>
              <form onSubmit={handleSearch} className='flex'>
                <input
                  type='text'
                  placeholder='Search books...'
                  className='px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type='submit'
                  className='bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-r-lg'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
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

            {/* Auth buttons or profile menu */}
            <div className='ml-4 flex items-center'>
              {!isAuthenticated ? (
                <div className='hidden md:flex md:space-x-4'>
                  <Link
                    to='/login'
                    className='px-4 py-2 text-gray-700 hover:text-black'
                  >
                    Sign In
                  </Link>
                  <Link
                    to='/register'
                    className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800'
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className='relative'>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className='flex items-center space-x-2 focus:outline-none'
                  >
                    <img
                      src={user?.avatar_url || '/placeholder-avatar.jpg'}
                      alt={user?.name}
                      className='h-8 w-8 rounded-full object-cover'
                    />
                    <span className='hidden md:block'>{user?.name}</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {profileMenuOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                      <Link
                        to='/profile'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to='/favorites'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className='flex md:hidden ml-4'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none'
              >
                <svg
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d={
                      mobileMenuOpen
                        ? 'M6 18L18 6M6 6l12 12'
                        : 'M4 6h16M4 12h16M4 18h16'
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='md:hidden px-4 pt-2 pb-4 bg-white'>
          <form onSubmit={handleSearch} className='mb-4'>
            <div className='flex'>
              <input
                type='text'
                placeholder='Search books...'
                className='w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type='submit'
                className='bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-r-lg'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className='space-y-1'>
            <Link
              to='/books'
              className='block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
              onClick={() => setMobileMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              to='/authors'
              className='block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
              onClick={() => setMobileMenuOpen(false)}
            >
              Authors
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  className='block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Library
                </Link>
                <Link
                  to='/favorites'
                  className='block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className='pt-4 flex flex-col space-y-2'>
                <Link
                  to='/login'
                  className='px-4 py-2 text-center border border-gray-300 text-gray-700 hover:bg-gray-50 rounded'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 text-center bg-black text-white hover:bg-gray-800 rounded'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
