import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      if (email && password && name) {
        navigate('/login');
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError("Registration failed. Please try again.");
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Subtle Wave Animation Background */}
      <div className="absolute inset-0">
        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <div className="login-logo-container">
                <div className="login-logo">
                  <div className="clock-ring"></div>
                  <div className="clock-face">
                    <div className="clock-hand hour-hand"></div>
                    <div className="clock-hand minute-hand"></div>
                    <div className="clock-center"></div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-silver-light via-silver to-silver-dark bg-clip-text text-transparent mb-3">
              Join Timer Studio
            </h1>
            <p className="text-lg text-silver-muted">
              Create your account and start your premium journey
            </p>
          </div>

          {/* Registration Form */}
          <div className="glass-card p-8">
            <div onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="name" className="input-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg
                      className="w-5 h-5 text-silver"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="glass-input with-icon"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg
                      className="w-5 h-5 text-silver"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="glass-input with-icon"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg
                      className="w-5 h-5 text-silver"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="glass-input with-icon"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" required />
                  <span className="text-silver-muted">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-silver hover:text-white transition-colors duration-300 underline decoration-silver-muted hover:decoration-silver bg-transparent border-none cursor-pointer"
                      onClick={() =>
                        alert("In a real app, this would show terms of service")
                      }
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-silver hover:text-white transition-colors duration-300 underline decoration-silver-muted hover:decoration-silver bg-transparent border-none cursor-pointer"
                      onClick={() =>
                        alert("In a real app, this would show privacy policy")
                      }
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="premium-button"
              >
                <span className="button-content">
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-silver-muted">
                Already have an account?{" "}
                <button
                  onClick={() =>
                    alert("In a real app, this would navigate to login")
                  }
                  className="text-silver hover:text-white transition-colors duration-300 underline decoration-silver-muted hover:decoration-silver bg-transparent border-none cursor-pointer font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Social Registration Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-silver"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-silver-muted">
                  Or sign up with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="social-button">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="social-button">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --silver-light: #e5e7eb;
          --silver: #c0c0c0;
          --silver-dark: #9ca3af;
          --silver-muted: #6b7280;
        }

        .text-silver-light {
          color: var(--silver-light);
        }
        .text-silver {
          color: var(--silver);
        }
        .text-silver-dark {
          color: var(--silver-dark);
        }
        .text-silver-muted {
          color: var(--silver-muted);
        }
        .border-silver {
          border-color: var(--silver);
        }
        .decoration-silver {
          text-decoration-color: var(--silver);
        }
        .decoration-silver-muted {
          text-decoration-color: var(--silver-muted);
        }
        .bg-silver {
          background-color: var(--silver);
        }

        .bg-gradient-to-r.from-silver-light.via-silver.to-silver-dark {
          background-image: linear-gradient(
            to right,
            var(--silver-light),
            var(--silver),
            var(--silver-dark)
          );
        }

        .wave-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--silver),
            transparent
          );
          opacity: 0.3;
        }

        .wave1 {
          top: 20%;
          animation: wave-move 15s ease-in-out infinite;
        }

        .wave2 {
          top: 50%;
          animation: wave-move 20s ease-in-out infinite reverse;
          opacity: 0.2;
        }

        .wave3 {
          top: 80%;
          animation: wave-move 25s ease-in-out infinite;
          opacity: 0.1;
        }

        @keyframes wave-move {
          0%,
          100% {
            transform: translateX(-50%);
          }
          50% {
            transform: translateX(-25%);
          }
        }

        .glass-card {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--silver);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(192, 192, 192, 0.1);
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--silver),
            transparent
          );
        }

        .login-logo-container {
          perspective: 1000px;
        }

        .login-logo {
          position: relative;
          width: 80px;
          height: 80px;
          transform-style: preserve-3d;
        }

        .clock-ring {
          position: absolute;
          inset: 0;
          border: 2px solid var(--silver);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.9);
        }

        .clock-face {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.95);
        }

        .clock-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          background: var(--silver);
          border-radius: 2px;
          transform-origin: bottom center;
        }

        .hour-hand {
          width: 3px;
          height: 20px;
          transform: translateX(-50%) translateY(-100%) rotate(45deg);
        }

        .minute-hand {
          width: 2px;
          height: 28px;
          transform: translateX(-50%) translateY(-100%) rotate(180deg);
        }

        .clock-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: var(--silver);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .input-group {
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--silver);
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          transition: color 0.3s ease;
        }

        .glass-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--silver);
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .glass-input.with-icon {
          padding-left: 3rem;
        }

        .glass-input::placeholder {
          color: var(--silver-muted);
        }

        .glass-input:focus {
          border-color: var(--silver-light);
          box-shadow: 0 0 0 4px rgba(192, 192, 192, 0.1),
            0 8px 25px -8px rgba(192, 192, 192, 0.2);
          transform: translateY(-2px);
        }

        .custom-checkbox {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border: 1px solid var(--silver);
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.9);
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .custom-checkbox:checked {
          background: var(--silver);
          border-color: var(--silver-light);
        }

        .custom-checkbox:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: black;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .premium-button {
          width: 100%;
          padding: 0;
          background: linear-gradient(
            135deg,
            var(--silver),
            var(--silver-dark)
          );
          border: 1px solid var(--silver-light);
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          color: black;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(192, 192, 192, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .premium-button:active {
          transform: translateY(0);
        }

        .premium-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .premium-button:hover::before {
          left: 100%;
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--silver);
          border-radius: 12px;
          color: var(--silver);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-button:hover {
          background: rgba(0, 0, 0, 0.95);
          border-color: var(--silver-light);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -8px rgba(192, 192, 192, 0.2);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top: 2px solid black;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: rgb(248, 113, 113);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          text-align: center;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;
