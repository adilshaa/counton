import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthDetails = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Navigate to login after logout
  };

  if (!isAuthenticated || !currentUser) {
    // Or a Link to login, or null if you prefer it to be invisible when logged out
    // For this setup, returning null makes sense as it's part of the main app UI.
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/40 shadow-lg">
      <span className="text-sm text-gray-300">
        Welcome, <span className="font-medium text-blue-400">{currentUser.name || currentUser.email}</span>!
      </span>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthDetails;
