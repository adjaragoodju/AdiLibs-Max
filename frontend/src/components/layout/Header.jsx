// src/components/layout/Header.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className='bg-blue-600 text-white shadow-md'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
          {/* Logo and mobile menu button */}
          <div className='flex items-center justify-between'>
            <Link to='/' className='text-2xl font-bold'>
              AdiLibs
            </Link>
            <button
              onClick={toggleMenu}
              className='md:hidden p-2 focus:outline-none'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className='h-6 w-6'
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation links and search */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:flex md:items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0`}
          >
            {/* Navigation links */}
            <nav className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6'>
              <Link
                to='/'
                className='hover:text-blue-200 transition duration-150'
              >
                Home
              </Link>
              <Link
                to='/books'
                className='hover:text-blue-200 transition duration-150'
              >
                Browse Books
              </Link>
              <Link
                to='/authors'
                className='hover:text-blue-200 transition duration-150'
              >
                Authors
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to='/my-books'
                    className='hover:text-blue-200 transition duration-150'
                  >
                    My Library
                  </Link>
                  <Link
                    to='/favorites'
                    className='hover:text-blue-200 transition duration-150'
                  >
                    Favorites
                  </Link>
                </>
              )}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className='flex'>
              <input
                type='text'
                placeholder='Search books...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='px-3 py-2 rounded-l text-gray-800 w-full md:w-56'
              />
              <button
                type='submit'
                className='bg-blue-700 px-4 py-2 rounded-r hover:bg-blue-800 transition duration-150'
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

            {/* Auth Links (after search bar as requested) */}
            <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
              {isAuthenticated ? (
                <>
                  <div className='relative group'>
                    <button className='flex items-center space-x-1 hover:text-blue-200 transition duration-150'>
                      <span>{user?.name}</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </button>
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
                      <Link
                        to='/profile'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='hover:text-blue-200 transition duration-150'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition duration-150'
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
