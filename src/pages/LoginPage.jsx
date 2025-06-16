import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to login.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Login submit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-800 dark:text-white flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-2xl border border-gray-300/60 dark:border-gray-700/30 rounded-xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text">
          Login to Timer Studio
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-500/10 dark:bg-red-500/10 p-2 rounded-lg border border-red-600/30 dark:border-red-500/30">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-white/60 dark:bg-gray-700/50 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-500/70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-white/60 dark:bg-gray-700/50 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-500/70 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-500/80 dark:to-purple-600/80 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white px-4 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
