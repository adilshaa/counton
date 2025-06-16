import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRouteOnly = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If authenticated, redirect to the main app page (e.g., dashboard or home).
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the child route component (e.g., Login or Register page).
  return <Outlet />;
};

export default PublicRouteOnly;
