// src/components/layout/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = 'hidden';

    // Add escape key listener
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Trap focus within modal for accessibility
    const handleFocus = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        event.preventDefault();
        modalRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleEsc);
    document.addEventListener('focusin', handleFocus);

    return () => {
      // Clean up
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [onClose]);

  return createPortal(
    <div
      className='fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto'
      onClick={onClose}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
        backdropFilter: 'blur(3px)', // Optional: adds a slight blur effect to the background
      }}
    >
      <div
        ref={modalRef}
        className='relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none'
          aria-label='Close modal'
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
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className='p-6'>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
