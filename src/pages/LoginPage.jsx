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
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/30 dark:border-slate-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md">
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
              className="w-full p-3 bg-white/50 dark:bg-slate-700/40 text-slate-900 dark:text-white rounded-xl border border-white/40 dark:border-slate-600/60 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500"
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
              className="w-full p-3 bg-white/50 dark:bg-slate-700/40 text-slate-900 dark:text-white rounded-xl border border-white/40 dark:border-slate-600/60 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white px-4 py-3 rounded-xl font-bold text-lg transition-all duration-150 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-purple-500/70 active:scale-95"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-150">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
