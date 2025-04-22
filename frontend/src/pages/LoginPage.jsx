// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);

      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({
          ...errors,
          password: 'Invalid credentials',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h1 className='text-2xl font-bold text-center mb-6'>
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Enter your password'
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>{errors.password}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-600 hover:underline'>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
