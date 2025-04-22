// src/pages/AuthorDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthorDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/authors/${id}`);
        setAuthor(response.data);
      } catch (err) {
        console.error('Error fetching author details:', err);
        setError('Failed to load author details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorDetails();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/authors/${id}` } });
      return;
    }

    try {
      if (author.isFollowing) {
        await api.delete(`/authors/${id}/follow`);
        toast.success(`Unfollowed ${author.name}`);
      } else {
        await api.post(`/authors/${id}/follow`);
        toast.success(`Now following ${author.name}`);
      }

      // Update author state
      setAuthor({
        ...author,
        isFollowing: !author.isFollowing,
        followerCount: author.isFollowing
          ? author.followerCount - 1
          : author.followerCount + 1,
      });
    } catch (err) {
      toast.error('Failed to update follow status');
      console.error('Error updating follow status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );
  }

  if (!author) {
    return (
      <div className='text-center py-8'>
        <h3 className='text-xl font-medium'>Author not found</h3>
        <p className='text-gray-600 mt-2'>
          The author you're looking for might have been removed or doesn't
          exist.
        </p>
        <Link
          to='/authors'
          className='text-blue-600 hover:underline mt-4 inline-block'
        >
          Browse all authors
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      {/* Author Info */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='md:flex'>
          {/* Author Image */}
          <div className='md:w-1/3 h-64 md:h-auto'>
            <img
              src={author.image_url || '/placeholder-author.png'}
              alt={author.name}
              className='w-full h-full object-cover'
            />
          </div>

          {/* Author Details */}
          <div className='p-6 md:w-2/3'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {author.name}
              </h1>

              <button
                onClick={handleToggleFollow}
                className={`px-4 py-2 rounded-md ${
                  author.isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {author.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            <div className='mt-4 flex items-center text-gray-600'>
              <span>
                {author.followerCount}{' '}
                {author.followerCount === 1 ? 'follower' : 'followers'}
              </span>
              <span className='mx-2'>•</span>
              <span>
                {author.books.length}{' '}
                {author.books.length === 1 ? 'book' : 'books'}
              </span>
            </div>

            {author.birth_date && (
              <p className='mt-4 text-gray-600'>
                Born: {new Date(author.birth_date).toLocaleDateString()}
              </p>
            )}

            {author.bio && (
              <div className='mt-4'>
                <h3 className='text-lg font-medium text-gray-800'>
                  About the Author
                </h3>
                <p className='mt-2 text-gray-600 whitespace-pre-line'>
                  {author.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Books by Author */}
      <div>
        <h2 className='text-2xl font-bold mb-6'>Books by {author.name}</h2>

        {author.books.length === 0 ? (
          <p className='text-gray-600'>No books found for this author.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {author.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDetailPage;
