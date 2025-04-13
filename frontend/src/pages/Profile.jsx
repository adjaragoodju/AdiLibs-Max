import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userBookService, reviewService } from '../services/api';
import ReadingStats from './ReadingStats';
import UserBooksList from './UserBooksList';
import UserReviewsList from './UserReviewsList';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('reading');
  const [userBooks, setUserBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [readingStats, setReadingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [booksResponse, reviewsResponse, statsResponse] =
          await Promise.all([
            userBookService.getUserBooks(),
            reviewService.getUserReviews(),
            userBookService.getReadingStats(),
          ]);

        setUserBooks(booksResponse.data);
        setUserReviews(reviewsResponse.data);
        setReadingStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filterBooksByStatus = (status) => {
    return userBooks.filter((book) => book.status === status);
  };

  return (
    <div className='container mx-auto px-6 py-10'>
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      ) : (
        <>
          <div className='flex flex-col md:flex-row gap-8 mb-12'>
            <div className='md:w-1/3'>
              <div className='bg-white shadow-md rounded-lg overflow-hidden p-6'>
                <div className='flex flex-col items-center'>
                  <img
                    src={user?.avatar_url || '/placeholder-avatar.jpg'}
                    alt={user?.name}
                    className='w-32 h-32 rounded-full object-cover mb-4'
                  />
                  <h2 className='text-2xl font-bold mb-1'>{user?.name}</h2>
                  <p className='text-gray-600 mb-4'>{user?.email}</p>

                  <button className='text-sm text-blue-600 hover:underline'>
                    Edit Profile
                  </button>
                </div>

                <div className='mt-8'>
                  <ReadingStats stats={readingStats} />
                </div>
              </div>
            </div>

            <div className='md:w-2/3'>
              <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <div className='border-b'>
                  <nav className='flex'>
                    <button
                      onClick={() => setActiveTab('reading')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'reading'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Currently Reading ({filterBooksByStatus('reading').length}
                      )
                    </button>
                    <button
                      onClick={() => setActiveTab('want_to_read')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'want_to_read'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Want to Read ({filterBooksByStatus('want_to_read').length}
                      )
                    </button>
                    <button
                      onClick={() => setActiveTab('completed')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'completed'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Completed ({filterBooksByStatus('completed').length})
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`px-6 py-4 text-sm font-medium ${
                        activeTab === 'reviews'
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Reviews ({userReviews.length})
                    </button>
                  </nav>
                </div>

                <div className='p-6'>
                  {activeTab === 'reviews' ? (
                    <UserReviewsList reviews={userReviews} />
                  ) : (
                    <UserBooksList
                      books={filterBooksByStatus(activeTab)}
                      status={activeTab}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
