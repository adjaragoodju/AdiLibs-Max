// frontend/src/components/ui/FormInput.jsx
import React from 'react';

/**
 * Reusable form input component with validation
 */
const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  className = '',
  helpText,
  ...props
}) => {
  const inputId = id || name;
  const hasError = error && touched;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-gray-700 text-sm font-bold mb-2'
        >
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        />
      )}

      {helpText && !hasError && (
        <p className='text-gray-500 text-xs mt-1'>{helpText}</p>
      )}

      {hasError && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default FormInput;
