// components/Hero.jsx
import React from 'react';

const Hero = ({ homeRef, scrollToSection, genresRef }) => {
  return (
    <section id='home' ref={homeRef} className='relative'>
      <div className='absolute inset-0 bg-black opacity-60 z-10'></div>
      <img
        src='/hero-bg.jpg'
        className='w-full h-[568px] object-cover'
        alt='Library of books'
      />

      <div className='absolute z-20 inset-0 flex items-center'>
        <div className='container mx-auto px-7'>
          <div className='max-w-xl'>
            <h1 className='text-5xl font-bold text-white mb-6'>
              Discover Your Next Favorite Book
            </h1>
            <div className='text-xl font-light text-white mb-8'>
              Explore our curated collection of books that will expand your mind
              and fuel your passion for reading.
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href='#browse'
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(genresRef);
                }}
                className='bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block text-center'
              >
                Browse Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
