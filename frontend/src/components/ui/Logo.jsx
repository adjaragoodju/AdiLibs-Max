import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <a
      className={`text-3xl font-bold ${className}`}
      href='/'
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      AdiLibs
    </a>
  );
};

export default Logo;
