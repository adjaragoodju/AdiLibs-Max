import React from 'react';

const NavLink = ({ href, isActive, children }) => {
  return (
    <a
      href={href}
      className={`
        relative 
        font-medium 
        text-lg 
        hover:text-gray-800
        transition-colors
        ${isActive ? 'text-black' : 'text-gray-600'}
      `}
    >
      {children}
      {isActive && (
        <span className='absolute bottom-0 left-0 w-full h-0.5 bg-black transform -translate-y-1'></span>
      )}
    </a>
  );
};

export default NavLink;
