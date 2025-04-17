// frontend/src/components/WriteReviewForm.jsx
import React, { useState } from 'react';
import useFormValidation from '../hooks/useFormValidation';
import { validateReviewForm } from '../utils/validation';

const WriteReviewForm = ({
  onSubmit,
  initialRating = 0,
  initialContent = '',
}) => {
  // Stars UI state - separate from form validation
  const [hoveredStar, setHoveredStar] = useState(null);

  // Initial form values
  const initialValues = {
    rating: initialRating,
    content: initialContent,
  };

  // Process the form submission
  const handleReviewSubmit = (values) => {
    onSubmit({
      rating: Number(values.rating),
      content: values.content,
    });
    resetForm();
  };

  // Use our custom form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation(initialValues, validateReviewForm, handleReviewSubmit);

  // Handle star click
  const handleStarClick = (rating) => {
    setFieldValue('rating', rating);
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white rounded-lg p-6 shadow-sm'>
      <div className='mb-6'>
        <label className='block text-gray-700 font-medium mb-2'>
          Your Rating
        </label>
        <div className='flex items-center'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleStarClick(star)}
              className='text-3xl focus:outline-none'
              aria-label={`Rate ${star} stars out of 5`}
            >
              <span
                className={`${
                  hoveredStar !== null
                    ? star <= hoveredStar
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                    : star <= values.rating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              >
                ★
              </span>
            </button>
          ))}
          <span className='ml-2 text-sm text-gray-600'>
            {values.rating > 0
              ? `${values.rating} out of 5 stars`
              : 'Click to rate'}
          </span>
        </div>
        {errors.rating && touched.rating && (
          <p className='text-red-500 text-xs mt-1'>{errors.rating}</p>
        )}
      </div>

      <div className='mb-6'>
        <label
          htmlFor='review-content'
          className='block text-gray-700 font-medium mb-2'
        >
          Your Review
        </label>
        <textarea
          id='review-content'
          name='content'
          rows='6'
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content && touched.content
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          placeholder='Share your thoughts about this book...'
        ></textarea>
        {errors.content && touched.content && (
          <p className='text-red-500 text-xs mt-1'>{errors.content}</p>
        )}
        <div className='text-right text-xs text-gray-500 mt-1'>
          {values.content.length}/2000 characters
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          type='button'
          onClick={resetForm}
          className='mr-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting || !isValid}
          className={`bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors ${
            isSubmitting || !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default WriteReviewForm;
