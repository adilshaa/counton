import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page.
    // `replace` prop ensures that the login route does not get added to history,
    // so clicking 'back' after login won't take you back to the login page.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes.
  // <Outlet /> is a placeholder for the nested route's component.
  return <Outlet />;
};

export default ProtectedRoute;
