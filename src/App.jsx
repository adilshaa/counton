import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import new custom pages
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
// Only UserProfile might be needed from here now, or this import might be removed if not used.
import { UserProfile } from '@clerk/clerk-react';
import TimeCounterVideoApp from './pages/counter';
// Removed PaymentPage import
import ProtectedRoute from './components/ProtectedRoute';
import PublicRouteOnly from './components/PublicRouteOnly';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<PublicRouteOnly />}>
        {/* Route to custom LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        {/* Route to custom RegistrationPage */}
        <Route path="/register" element={<RegistrationPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<TimeCounterVideoApp />} />
        {/* Removed /payment route */}
        {/* New route for Clerk UserProfile */}
        <Route path="/user-profile" element={<UserProfile path="/user-profile" routing="path" />} />
      </Route>
    </Routes>
  );
}

export default App;
