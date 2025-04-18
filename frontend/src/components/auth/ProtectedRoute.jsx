// frontend/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Protected route component that ensures user is authenticated
 * Redirects to login page if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // Wait until auth is initialized
  if (!initialized) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Save the intended destination
    const redirectPath = `/login?redirect=${encodeURIComponent(
      location.pathname + location.search
    )}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if authenticated
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
