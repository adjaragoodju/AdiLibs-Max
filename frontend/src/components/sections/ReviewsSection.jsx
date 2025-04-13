// src/components/sections/ReviewsSection.jsx
import React, { useState } from 'react';
import Modal from '../layout/Modal';
import ReviewCard from '../ui/ReviewCard';

const ReviewModal = ({ review, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center mb-6'>
          <img
            src={review.avatar || '/placeholder-avatar.jpg.avif'}
            alt={review.name}
            className='w-16 h-16 rounded-full object-cover mr-5'
            onError={(e) => {
              e.target.src = '/placeholder-avatar.jpg.avif';
            }}
          />
          <div>
            <h3 className='text-2xl font-bold'>{review.name}</h3>
            <div className='flex items-center mt-1'>
              <div className='flex mr-3'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill={star <= review.rating ? '#FBBF24' : '#D1D5DB'}
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='text-gray-500'>{review.date}</span>
            </div>
          </div>
        </div>

        <div className='bg-gray-50 p-6 rounded-lg'>
          <p className='text-gray-700 leading-relaxed text-lg'>
            {review.fullText}
          </p>

          {review.bookReviewed && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <h4 className='font-medium mb-2'>Book Reviewed:</h4>
              <div className='flex items-center'>
                <img
                  src={review.bookReviewed.image || '/placeholder-book.jpg'}
                  alt={review.bookReviewed.title}
                  className='w-16 h-24 object-cover rounded mr-4'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
                <div>
                  <p className='font-bold'>{review.bookReviewed.title}</p>
                  <p className='text-gray-600'>{review.bookReviewed.author}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const ReviewsSection = ({ reviewsRef }) => {
  const [selectedReview, setSelectedReview] = useState(null);

  // Review data
  const reviews = [
    {
      name: 'Sarah Johnson',
      avatar: '/reviewers/sarah.jpg',
      rating: 5,
      text: 'AdiLibs has completely transformed my reading experience! The user-friendly interface makes it so easy to discover new books. I especially love how I can filter by genre and author.',
      fullText:
        "AdiLibs has completely transformed my reading experience! The user-friendly interface makes it so easy to discover new books. I especially love how I can filter by genre and author. I've already discovered several amazing authors I'd never heard of before. The recommendations offered by the platform are very accurate, and I always find something interesting. The favorites feature helps me keep track of books I want to read in the future. I recommend this platform to all book lovers!",
      date: 'March 15, 2025',
      bookReviewed: {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        image: '/the-hobbit.jpg',
      },
    },
    {
      name: 'Michael Chen',
      avatar: '/reviewers/michael.jpg',
      rating: 4,
      text: "Great selection of books across multiple genres. The author recommendations are spot on, and I've discovered several new favorites through this platform.",
      fullText:
        "Great selection of books across multiple genres. The author recommendations are spot on, and I've discovered several new favorites through this platform. I particularly enjoy the 'Popular Books This Month' section, which helps me stay current with the latest trends. The interface is intuitive, and site navigation is very convenient. The only thing that could be improved is adding more options for customizing personal recommendations. Overall, an excellent service for reading enthusiasts!",
      date: 'February 22, 2025',
      bookReviewed: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        image: '/pride-prejudice.jpg',
      },
    },
    {
      name: 'Elena Rodriguez',
      avatar: '/reviewers/elena.jpg',
      rating: 5,
      text: 'The curated collections are absolutely fantastic! I love how AdiLibs suggests books based on my previous readings. The favorites feature helps me keep track of what I want to read next.',
      fullText:
        "The curated collections are absolutely fantastic! I love how AdiLibs suggests books based on my previous readings. The favorites feature helps me keep track of what I want to read next. I also appreciate being able to see other readers' reviews before choosing a book. This has saved me a lot of time that I would have spent on books that aren't right for me. The interface is very pleasing to the eye, and the monthly newsletter always contains interesting recommendations. AdiLibs has become my main source for discovering new books!",
      date: 'March 28, 2025',
      bookReviewed: {
        title: 'Dune',
        author: 'Frank Herbert',
        image: '/dune.jpg',
      },
    },
    {
      name: 'David Thompson',
      avatar: '/reviewers/david.jpg',
      rating: 5,
      text: 'As an avid reader, I appreciate how easy AdiLibs makes it to find quality books. The interface is clean, navigation is intuitive, and the recommendations are spot-on.',
      fullText:
        'As an avid reader, I appreciate how easy AdiLibs makes it to find quality books. The interface is clean, navigation is intuitive, and the recommendations are spot-on. I especially value the authors section, which helps me find all books by one author, particularly if I enjoyed one of their works. Filtering by genres is also very useful when I want to read something specific. Book downloads are fast, and the reading format is very convenient. I definitely recommend AdiLibs to anyone looking for a new reading platform!',
      date: 'March 5, 2025',
      bookReviewed: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        image: '/gatsby.jpg',
      },
    },
  ];

  return (
    <section
      id='reviews'
      ref={reviewsRef}
      className='bg-black text-white py-20'
    >
      <div className='container mx-auto px-6'>
        <div className='text-center mb-16'>
          <div className='text-gray-400 font-medium mb-2 text-sm tracking-widest uppercase'>
            TESTIMONIALS
          </div>
          <h2 className='text-4xl font-bold mb-4'>What Our Readers Say</h2>
          <p className='text-gray-300 max-w-2xl mx-auto'>
            Join thousands of satisfied readers who have discovered their next
            favorite book through AdiLibs.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.name}
              avatar={review.avatar}
              rating={review.rating}
              text={review.text}
              date={review.date}
              onClick={() => setSelectedReview(review)}
            />
          ))}
        </div>
      </div>

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </section>
  );
};

export default ReviewsSection;
