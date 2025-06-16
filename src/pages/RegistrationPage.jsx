import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Failed to register.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Registration submit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col md:flex-row transition-colors duration-300">
      {/* Left Section: Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-12">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/30 dark:border-slate-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-transparent dark:bg-gradient-to-r dark:from-green-400 dark:via-teal-400 dark:to-emerald-500 dark:bg-clip-text">
            Create Your Timer Studio Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-500/10 dark:bg-red-500/10 p-2 rounded-lg border border-red-600/30 dark:border-red-500/30">{error}</p>}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-white/50 dark:bg-slate-700/40 text-slate-900 dark:text-white rounded-xl border border-white/40 dark:border-slate-600/60 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Your Name"
              />
            </div>
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
                className="w-full p-3 bg-white/50 dark:bg-slate-700/40 text-slate-900 dark:text-white rounded-xl border border-white/40 dark:border-slate-600/60 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500"
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
                className="w-full p-3 bg-white/50 dark:bg-slate-700/40 text-slate-900 dark:text-white rounded-xl border border-white/40 dark:border-slate-600/60 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-500 dark:hover:to-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-lg transition-all duration-150 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-emerald-500/70 active:scale-95"
            >
              Create Account
            </button>
          </form>
          <p className="text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-150">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section: Design/Content */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center p-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 dark:from-blue-600 dark:via-purple-700 dark:to-pink-600">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-white tracking-tight mb-4">
            Welcome to Timer Studio!
          </h2>
          <p className="text-2xl text-purple-100 dark:text-pink-200 mb-8">
            Organize your time, beautifully.
          </p>
          <div className="w-48 h-48 bg-white/20 dark:bg-black/20 rounded-full mx-auto animate-pulse flex items-center justify-center">
            <svg className="w-24 h-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
