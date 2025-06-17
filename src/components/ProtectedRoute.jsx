import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const ProtectedRoute = () => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    // Wait for Clerk to load before making a decision
    return null; // Or a loading spinner
  }

  if (!userId) {
    // If not signed in after Clerk has loaded, redirect to the login page.
    return <Navigate to="/login" replace />;
  }

  // If signed in, render the child routes.
  return <Outlet />;
};

export default ProtectedRoute;
