import React from 'react';

const AboutUsSection = ({ aboutRef }) => {
  return (
    <section id='about' ref={aboutRef} className='bg-gray-50 py-20'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className='inline-block mb-3'>
            <div className='w-20 h-px bg-black mx-auto mb-2'></div>
            <div className='text-sm tracking-widest text-gray-700 uppercase'>
              OUR STORY
            </div>
          </div>
          <h2 className='text-4xl font-bold mb-6'>About AdiLibs</h2>
          <p className='text-gray-700 max-w-3xl mx-auto mb-8'>
            Founded in 2025, AdiLibs is a passion project born from our love of
            books and the desire to create a community where readers can
            discover new stories and share their experiences.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-blue-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold mb-2'>Our Mission</h3>
            <p className='text-gray-600'>
              We believe everyone has a book that can change their life. Our
              mission is to help readers discover their next great read through
              personalized recommendations and curated collections.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-green-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold mb-2'>Our Team</h3>
            <p className='text-gray-600'>
              We're a team of passionate book lovers, librarians, and technology
              experts working together to create the best book discovery
              platform possible.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all'>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-purple-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold mb-2'>Our Values</h3>
            <p className='text-gray-600'>
              We're committed to fostering a diverse reading culture, promoting
              literacy, and making quality literature accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
