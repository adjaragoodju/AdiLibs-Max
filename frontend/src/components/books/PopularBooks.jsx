import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Book from './Book';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const PopularBooks = ({ books, handleBookClick }) => {
  return (
    <section className='container mx-auto px-4 mt-16'>
      <div className='flex justify-between items-end mb-8'>
        <div>
          <div className='text-gray-700 font-medium mb-2 tracking-widest text-sm uppercase'>
            DISCOVER
          </div>
          <h2 className='text-4xl font-bold'>Popular Books This Month</h2>
        </div>
      </div>

      <div className='relative'>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView='auto'
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className='books-swiper py-4'
        >
          {books.slice(0, 10).map((book, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleBookClick(book)}
                className='cursor-pointer transition-transform hover:scale-105'
              >
                <Book
                  title={book.title}
                  author={book.author}
                  year={book.year}
                  image={book.image || '/placeholder-book.jpg'}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className='swiper-button-prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg text-black z-10 w-12 h-12 flex items-center justify-center'
          aria-label='Previous books'
        >
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
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        <button
          className='swiper-button-next absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg text-black z-10 w-12 h-12 flex items-center justify-center'
          aria-label='Next books'
        >
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
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default PopularBooks;
