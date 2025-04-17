// frontend/src/components/ui/SearchHighlight.jsx
import React from 'react';

/**
 * Component to highlight search terms within text
 * @param {Object} props - Component properties
 * @param {string} props.text - The original text to display
 * @param {string} props.searchTerm - The search term to highlight
 * @param {string} props.className - Additional CSS classes for the component
 * @returns {JSX.Element} - Rendered component with highlighted search terms
 */
const SearchHighlight = ({ text, searchTerm, className = '' }) => {
  // If there's no search term or no text, just return the original text
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  // Create a case-insensitive regular expression for the search term
  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );

  // Split the text by the search term matches
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // If the part matches the search term (case-insensitive), highlight it
        const isMatch = part.toLowerCase() === searchTerm.toLowerCase();

        return isMatch ? (
          <mark key={index} className='bg-yellow-200 px-0.5 rounded'>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
};

export default SearchHighlight;
