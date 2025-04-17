// frontend/src/pages/Login.jsx
import React, { useContext } from 'react';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';
import { validateLoginForm } from '../utils/validation';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect URL from query params if available
  const redirectUrl =
    new URLSearchParams(location.search).get('redirect') || '/';

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  // Handle successful login
  const handleLogin = async (values) => {
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // If remember me is checked, store for 30 days
      if (values.rememberMe) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        localStorage.setItem('authExpiry', thirtyDaysFromNow.toString());
      }

      // Update user context
      setUser(response.data.user);

      // Redirect user
      navigate(redirectUrl);
    } catch (err) {
      // Set server error
      setServerError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  // Use our custom form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useFormValidation(initialValues, validateLoginForm, handleLogin);

  // Track server errors separately
  const [serverError, setServerError] = React.useState('');

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Sign In to AdiLibs
      </h1>

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
            placeholder='Your password'
          />
          {errors.password && touched.password && (
            <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
          )}
        </div>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center'>
            <input
              id='rememberMe'
              name='rememberMe'
              type='checkbox'
              checked={values.rememberMe}
              onChange={handleChange}
              className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label
              htmlFor='rememberMe'
              className='ml-2 block text-sm text-gray-900'
            >
              Remember me
            </label>
          </div>

          <a href='#' className='text-sm text-blue-600 hover:underline'>
            Forgot password?
          </a>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <div className='mt-6 text-center text-sm'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline'>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
