// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch popular books
        const popularResponse = await api.get('/books?sort=rating&limit=10');
        setPopularBooks(popularResponse.data.books);

        // Fetch recently added books
        const recentResponse = await api.get(
          '/books?sort=created_at&order=desc&limit=10'
        );
        setRecentlyAdded(recentResponse.data.books);

        // Fetch personalized recommendations if authenticated
        if (isAuthenticated) {
          try {
            const recommendationsResponse = await api.get(
              '/recommendations/personalized'
            );
            setRecommendations(recommendationsResponse.data.recommendations);
          } catch (error) {
            console.error('Failed to fetch recommendations:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='space-y-12'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 md:p-12'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>
            Discover Your Next Favorite Book
          </h1>
          <p className='text-lg md:text-xl mb-8'>
            Track your reading journey, discover new books, and connect with a
            community of readers.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/books'
              className='bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition duration-150'
            >
              Browse Books
            </Link>
            {!isAuthenticated && (
              <Link
                to='/register'
                className='bg-transparent hover:bg-white/10 border-2 border-white font-semibold px-6 py-3 rounded-lg transition duration-150'
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Books Carousel */}
      <section>
        <h2 className='text-2xl font-bold mb-6'>Featured Books</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className='py-4'
        >
          {popularBooks.slice(0, 8).map((book) => (
            <SwiperSlide key={book.id}>
              <Link to={`/books/${book.id}`}>
                <div className='group relative h-80 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1'>
                  <img
                    src={book.image_url || '/placeholder-book.png'}
                    alt={book.title}
                    className='object-cover w-full h-full'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white'>
                    <h3 className='font-bold text-lg'>{book.title}</h3>
                    <p>{book.author_name}</p>
                    <div className='flex items-center mt-2'>
                      <span className='text-yellow-400 mr-1'>★</span>
                      <span>{book.average_rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Personalized Recommendations (if authenticated) */}
      {isAuthenticated && recommendations.length > 0 && (
        <section>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Recommended For You</h2>
            <Link to='/books' className='text-blue-600 hover:underline'>
              View More
            </Link>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {recommendations.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added Books */}
      <section>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Recently Added</h2>
          <Link
            to='/books?sort=created_at&order=desc'
            className='text-blue-600 hover:underline'
          >
            View More
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {recentlyAdded.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && (
        <section className='bg-gray-100 rounded-lg p-8 text-center'>
          <h2 className='text-2xl font-bold mb-4'>
            Ready to start your reading journey?
          </h2>
          <p className='text-lg mb-6'>
            Join thousands of readers who are tracking their reading progress
            and discovering new books.
          </p>
          <Link
            to='/register'
            className='bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6 py-3 rounded-lg transition duration-150'
          >
            Create Your Free Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default HomePage;
