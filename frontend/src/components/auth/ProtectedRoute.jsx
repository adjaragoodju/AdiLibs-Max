// src/components/auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
