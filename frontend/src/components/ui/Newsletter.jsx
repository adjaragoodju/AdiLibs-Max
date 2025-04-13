import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === '') return;

    // In a real app, you would send this to your backend
    console.log('Email submitted:', email);

    // Show success message
    setSubmitted(true);
    setEmail('');

    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className='max-w-3xl mx-auto text-center'>
      <div className='text-blue-200 font-medium mb-2'>STAY UPDATED</div>
      <h2 className='text-4xl font-bold text-white mb-6'>
        Join Our Newsletter
      </h2>
      <p className='text-lg text-blue-100 mb-8'>
        Subscribe to get notified about new releases, book recommendations, and
        exclusive offers.
      </p>

      {submitted ? (
        <div className='bg-green-100 text-green-800 p-4 rounded-lg max-w-lg mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 mx-auto mb-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          <p className='font-medium'>Thank you for subscribing!</p>
          <p className='text-sm'>We'll send updates to your inbox.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='max-w-lg mx-auto flex flex-col sm:flex-row gap-2'
        >
          <input
            type='email'
            placeholder='Your email address'
            className='flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type='submit'
            className='bg-white hover:bg-gray-100 text-black font-medium px-6 py-3 rounded-lg transition-colors'
          >
            Subscribe
          </button>
        </form>
      )}

      <div className='mt-6 text-blue-200 text-sm'>
        No spam, just books. You can unsubscribe at any time.
      </div>
    </div>
  );
};

export default Newsletter;
