import React from 'react';
import Newsletter from '../ui/Newsletter';

const NewsletterSection = ({ newsletterRef }) => {
  return (
    <section ref={newsletterRef} className='bg-black py-20'>
      <div className='container mx-auto px-4'>
        <Newsletter />
      </div>
    </section>
  );
};

export default NewsletterSection;
