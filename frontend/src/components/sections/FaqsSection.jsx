import React, { useState } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <button
        className='w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className='text-xl font-bold'>{question}</h3>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`h-6 w-6 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      <div
        className={`px-6 pb-4 transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <p className='text-gray-600'>{answer}</p>
      </div>
    </div>
  );
};

const FaqsSection = ({ faqsRef }) => {
  const faqs = [
    {
      question: 'How do I add a book to my favorites?',
      answer:
        'When viewing a book, simply click the "Add to Favorites" button. You can access your favorites anytime by clicking the Favorites link in the navigation menu.',
    },
    {
      question: 'Are all books available for immediate reading?',
      answer:
        'Many books offer sample chapters that you can read immediately. For full books, we provide links to purchase or borrow from partnered libraries and bookstores.',
    },
    {
      question: 'How are book recommendations generated?',
      answer:
        "Our recommendations are based on your reading history, favorite genres, authors you follow, and books similar to ones you've enjoyed in the past.",
    },
    {
      question: 'Can I suggest books to be added to the platform?',
      answer:
        "Absolutely! We welcome suggestions from our community. Please use the Contact Us form with your recommendations and we'll review them.",
    },
    {
      question: 'Is there a mobile app available?',
      answer:
        'Yes! AdiLibs is available on iOS and Android devices. You can download our app from the App Store or Google Play Store to enjoy your favorite books on the go.',
    },
    {
      question: 'How can I update my account information?',
      answer:
        'To update your account information, simply click on your profile icon in the top right corner, select "Account Settings," and make your desired changes. Don\'t forget to save your updates.',
    },
  ];

  return (
    <section id='faqs' ref={faqsRef} className='container mx-auto px-4 py-20'>
      <div className='text-center mb-12'>
        <div className='inline-block mb-3'>
          <div className='w-20 h-px bg-black mx-auto mb-2'></div>
          <div className='text-sm tracking-widest text-gray-700 uppercase'>
            QUESTIONS
          </div>
        </div>
        <h2 className='text-4xl font-bold mb-6'>Frequently Asked Questions</h2>
        <p className='text-gray-700 max-w-2xl mx-auto'>
          Find answers to common questions about our platform.
        </p>
      </div>

      <div className='max-w-3xl mx-auto space-y-4'>
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FaqsSection;
