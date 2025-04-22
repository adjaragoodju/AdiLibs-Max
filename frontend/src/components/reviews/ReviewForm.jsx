// src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: '',
      });
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (errors.content) {
      setErrors({
        ...errors,
        content: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a rating';
    }

    if (!content.trim()) {
      newErrors.content = 'Review content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ rating, content });
      // Reset form on success
      setRating(0);
      setContent('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Star Rating */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Your Rating
        </label>
        <div className='flex items-center'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              className='text-2xl focus:outline-none mr-1'
            >
              {star <= (hoverRating || rating) ? '★' : '☆'}
            </button>
          ))}
          <span className='ml-2 text-gray-500'>
            {rating > 0
              ? `${rating} star${rating !== 1 ? 's' : ''}`
              : 'Select rating'}
          </span>
        </div>
        {errors.rating && (
          <p className='mt-1 text-sm text-red-600'>{errors.rating}</p>
        )}
      </div>

      {/* Review Content */}
      <div>
        <label
          htmlFor='review-content'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Your Review
        </label>
        <textarea
          id='review-content'
          rows={5}
          value={content}
          onChange={handleContentChange}
          placeholder='Write your review here...'
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
        ></textarea>
        {errors.content && (
          <p className='mt-1 text-sm text-red-600'>{errors.content}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default ReviewForm;
