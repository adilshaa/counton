import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext'; // Corrected path
import { Sun, Moon } from 'lucide-react';

const AuthDetails = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-300/50 dark:border-gray-700/40 shadow-lg">
      <span className="text-sm text-slate-700 dark:text-gray-300">
        Welcome, <span className="font-medium text-blue-600 dark:text-blue-400">{currentUser.name || currentUser.email}</span>!
      </span>
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        className="p-1.5 rounded-md hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors"
      >
        {theme === 'light' ? (
          <Moon size={16} className="text-slate-700 dark:text-gray-300" />
        ) : (
          <Sun size={16} className="text-slate-700 dark:text-gray-300" />
        )}
      </button>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 dark:from-red-500/80 dark:to-pink-600/80 dark:hover:from-red-600 dark:hover:to-pink-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthDetails;
