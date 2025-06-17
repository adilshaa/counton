import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Removed LoginPage, RegistrationPage imports
import { SignIn, SignUp, UserProfile } from '@clerk/clerk-react'; // Import Clerk components
import TimeCounterVideoApp from './pages/counter';
import PaymentPage from './pages/PaymentPage'; // Import PaymentPage
import ProtectedRoute from './components/ProtectedRoute';
import PublicRouteOnly from './components/PublicRouteOnly';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<PublicRouteOnly />}>
        {/* Updated to use Clerk's SignIn component */}
        <Route path="/login" element={<SignIn routing="path" path="/login" />} />
        {/* Updated to use Clerk's SignUp component */}
        <Route path="/register" element={<SignUp routing="path" path="/register" />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<TimeCounterVideoApp />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* New route for PaymentPage */}
        {/* New route for Clerk UserProfile */}
        <Route path="/user-profile" element={<UserProfile path="/user-profile" routing="path" />} />
      </Route>
    </Routes>
  );
}

export default App;
