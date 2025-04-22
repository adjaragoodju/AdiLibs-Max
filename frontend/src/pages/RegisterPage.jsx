// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Don't send confirmPassword to the server
      const { confirmPassword, ...registerData } = formData;

      await register(registerData);
      toast.success('Registration successful! Welcome to AdiLibs.');
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);

      // Handle specific error cases
      if (error.response?.data?.message?.includes('already exists')) {
        setErrors({
          ...errors,
          email: 'This email is already registered',
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
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Name
            </label>
            <input
              id='name'
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Enter your name'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </div>

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

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Confirm your password'
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
