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
        navigate('/login'); // Or show a success message and stay
      } else {
        setError(result.message || 'Failed to register.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Registration submit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/20 rounded-xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
          Create Your Timer Studio Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/30">{error}</p>}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-700/50 backdrop-blur-sm text-white rounded-lg border border-gray-600/50 focus:border-emerald-500/70 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
