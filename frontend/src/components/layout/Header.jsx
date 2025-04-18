// frontend/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const Header = ({
  uniqueGenres,
  uniqueAuthors,
  mobileMenuOpen,
  toggleMobileMenu,
  searchQuery,
  setSearchQuery,
  handleSearch,
  scrollToSection,
  homeRef,
  genresRef,
  authorsRef,
  reviewsRef,
  aboutRef,
  setShowFavoritesModal,
  hoveredNavItem,
  setHoveredNavItem,
  selectedGenre,
  setSelectedGenre,
  selectedAuthor,
  setSelectedAuthor,
}) => {
  const { favorites } = useFavorites();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toggleMobileMenu();
    navigate('/');
  };

  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-md z-50'>
      <div className='container mx-auto px-4'>
        <nav className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <Logo />
          </div>
          {/* Mobile menu button */}
          <button
            className='md:hidden'
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </button>
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(homeRef)}
              onMouseEnter={() => setHoveredNavItem('home')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'home'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Home
              </span>
            </button>

            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(genresRef)}
              onMouseEnter={() => setHoveredNavItem('genres')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'genres'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Genres
              </span>
            </button>

            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(authorsRef)}
              onMouseEnter={() => setHoveredNavItem('authors')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'authors'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Authors
              </span>
            </button>

            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(reviewsRef)}
              onMouseEnter={() => setHoveredNavItem('reviews')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'reviews'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Reviews
              </span>
            </button>

            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(aboutRef)}
              onMouseEnter={() => setHoveredNavItem('about')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'about'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                About Us
              </span>
            </button>

            {isAuthenticated ? (
              <div className='relative'>
                <button
                  className='font-medium hover:text-black transition-colors flex items-center'
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  onMouseEnter={() => setHoveredNavItem('profile')}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  <span
                    className={`relative ${
                      hoveredNavItem === 'profile'
                        ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                        : ''
                    }`}
                  >
                    {user?.name || 'My Account'}
                  </span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 ml-1'
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

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 hover:bg-gray-100'
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      className='font-medium block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors'
                      onClick={() => {
                        setShowFavoritesModal(true);
                        setProfileMenuOpen(false);
                      }}
                    >
                      <span className='flex items-center'>
                        Favorites
                        {favorites.length > 0 && (
                          <span className='ml-2 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                            {favorites.length}
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 border-t'
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-black transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className='hidden md:flex items-center ml-8'
          >
            <input
              type='text'
              placeholder='Search books...'
              className='px-4 py-2 border-2 rounded-l-lg focus:outline-none  w-64'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type='submit'
              className='bg-black hover:bg-gray-800  border-l-0 text-white px-6 py-2.5 h-full rounded-r-lg transition-colors flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-1'
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
              Search
            </button>
          </form>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 pb-6 border-t flex flex-col space-y-4'>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => scrollToSection(homeRef)}
            >
              Home
            </button>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => {
                setSelectedGenre(selectedGenre ? null : uniqueGenres[0]);
                scrollToSection(genresRef);
              }}
            >
              Genres
            </button>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => {
                setSelectedAuthor(selectedAuthor ? null : uniqueAuthors[0]);
                scrollToSection(authorsRef);
              }}
            >
              Authors
            </button>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => {
                scrollToSection(reviewsRef);
              }}
            >
              Reviews
            </button>
            <button
              className='font-medium hover:text-black transition-colors'
              onClick={() => {
                scrollToSection(aboutRef);
              }}
            >
              About Us
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  className='font-medium hover:text-black transition-colors'
                  onClick={toggleMobileMenu}
                >
                  My Profile
                </Link>
                <button
                  className='font-medium hover:text-black transition-colors'
                  onClick={() => {
                    setShowFavoritesModal(true);
                    toggleMobileMenu();
                  }}
                >
                  <span className='flex items-center'>
                    Favorites
                    {favorites.length > 0 && (
                      <span className='ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                        {favorites.length}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  className='font-medium text-red-600 hover:text-red-800 transition-colors text-left'
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className='flex flex-col space-y-2 pt-2'>
                <Link
                  to='/login'
                  className='text-center border border-gray-300 py-2 rounded hover:bg-gray-50 transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className='flex mt-2'>
              <input
                type='text'
                placeholder='Search books...'
                className='flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type='submit'
                className='bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-r-lg transition-colors flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
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
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
