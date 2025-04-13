import React, { useState, useContext } from 'react';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);

      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-16 max-w-md'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Sign In to AdiLibs
      </h1>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
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
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Your email'
          />
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
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Your password'
          />
        </div>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center'>
            <input
              id='remember'
              type='checkbox'
              className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label
              htmlFor='remember'
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
          disabled={loading}
          className='w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
        >
          {loading ? 'Signing in...' : 'Sign In'}
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
