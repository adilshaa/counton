import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const PublicRouteOnly = () => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    // Wait for Clerk to load
    return null; // Or a loading spinner
  }

  if (userId) {
    // If signed in after Clerk has loaded, redirect to the main app page.
    return <Navigate to="/" replace />;
  }

  // If not signed in, render the child route component (e.g., Clerk's SignIn or SignUp page).
  return <Outlet />;
};

export default PublicRouteOnly;
