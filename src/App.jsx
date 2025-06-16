import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import TimeCounterVideoApp from './pages/counter';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRouteOnly from './components/PublicRouteOnly';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<PublicRouteOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<TimeCounterVideoApp />} />
        {/* Add other protected routes here if needed */}
      </Route>
    </Routes>
  );
}

export default App;
