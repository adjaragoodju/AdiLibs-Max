// frontend/src/pages/Register.jsx
import React, { useContext, useState } from 'react';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';
import { validateRegistrationForm } from '../utils/validation';

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Handle successful registration
  const handleRegister = async (values) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await authService.register(registerData);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);

      navigate('/');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  // Use our custom form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation(
    initialValues,
    validateRegistrationForm,
    handleRegister
  );

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Create an Account</h1>

      {serverError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded-lg p-8'
      >
        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='name'
          >
            Name
          </label>
          <input
            id='name'
            name='name'
            type='text'
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Your name'
          />
          {errors.name && touched.name && (
            <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
          )}
        </div>

        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='email'
          >
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email && touched.email
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder='Your email'
          />
          {errors.email && touched.email && (
            <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
          )}
        </div>

        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password && touched.password
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder='Choose a password'
          />
          {errors.password && touched.password && (
            <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
          )}
          <div className='mt-2 text-xs text-gray-500'>
            <p>Password must:</p>
            <ul className='list-disc pl-5'>
              <li>Be at least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>
        </div>

        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='confirmPassword'
          >
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword && touched.confirmPassword
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder='Confirm your password'
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
            isSubmitting || !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className='mt-6 text-center text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
