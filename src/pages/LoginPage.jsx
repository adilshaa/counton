import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Simulate login process
    setTimeout(() => {
      if (email && password) {
        alert(
          "Login successful! In a real app, this would redirect to dashboard."
        );
        setEmail("");
        setPassword("");
      } else {
        setError("Login failed. Please check your credentials.");
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(148,163,184,0.12),transparent)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(148,163,184,0.08),transparent)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(148,163,184,0.06),transparent)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 left-16 w-20 h-20 border border-slate-400/20 rotate-45 animate-float-geometric"></div>
      <div className="absolute top-40 right-24 w-16 h-16 border border-slate-300/15 rounded-full animate-float-circle"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 border border-slate-500/10 rotate-12 animate-float-square"></div>
      <div className="absolute bottom-20 right-20 w-32 h-1 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent animate-float-line"></div>

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
                  <div className="logo-glow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-lg text-slate-400">
              Sign in to continue your journey with Timer Studio
            </p>
          </div>

          {/* Login Form */}
          <div className="glass-card p-8">
            <div onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg
                      className="w-5 h-5 text-slate-400"
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
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg
                      className="w-5 h-5 text-slate-400"
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
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="text-slate-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                  onClick={() =>
                    alert("In a real app, this would open forgot password")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="premium-button"
                onClick={handleSubmit}
              >
                <span className="button-content">
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing in...
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={() =>
                    alert("In a real app, this would navigate to register")
                  }
                  className="text-slate-300 hover:text-white transition-colors duration-300 underline decoration-slate-500 hover:decoration-slate-300 bg-transparent border-none cursor-pointer font-medium"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-950 text-slate-400">
                  Or continue with
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
        .glass-card {
          background: rgba(30, 41, 59, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(148, 163, 184, 0.1);
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
            rgba(148, 163, 184, 0.4),
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
          animation: logo-float 6s ease-in-out infinite;
        }

        .clock-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(148, 163, 184, 0.3);
          border-radius: 50%;
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(10px);
        }

        .clock-face {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(5px);
        }

        .clock-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          background: rgba(148, 163, 184, 0.8);
          border-radius: 2px;
          transform-origin: bottom center;
        }

        .hour-hand {
          width: 3px;
          height: 20px;
          transform: translateX(-50%) translateY(-100%) rotate(45deg);
          animation: clock-hour-slow 120s linear infinite;
        }

        .minute-hand {
          width: 2px;
          height: 28px;
          transform: translateX(-50%) translateY(-100%) rotate(180deg);
          animation: clock-minute-slow 60s linear infinite;
        }

        .clock-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: rgba(148, 163, 184, 0.9);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .logo-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(148, 163, 184, 0.1),
            transparent
          );
          animation: logo-glow 8s linear infinite;
        }

        .input-group {
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(148, 163, 184, 0.9);
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
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
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
          color: rgba(148, 163, 184, 0.5);
        }

        .glass-input:focus {
          border-color: rgba(148, 163, 184, 0.5);
          box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.1),
            0 8px 25px -8px rgba(148, 163, 184, 0.2);
          transform: translateY(-2px);
        }

        .glass-input:focus + .input-focus-border {
          width: 100%;
        }

        .input-focus-border {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.8),
            rgba(203, 213, 225, 0.8)
          );
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 1px;
        }

        .custom-checkbox {
          appearance: none;
          width: 1rem;
          height: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 4px;
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(5px);
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .custom-checkbox:checked {
          background: rgba(148, 163, 184, 0.8);
          border-color: rgba(148, 163, 184, 0.8);
        }

        .custom-checkbox:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .premium-button {
          width: 100%;
          padding: 0;
          background: linear-gradient(
            135deg,
            rgba(148, 163, 184, 0.9),
            rgba(100, 116, 139, 0.9)
          );
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(148, 163, 184, 0.4),
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
            rgba(255, 255, 255, 0.2),
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
          background: rgba(30, 41, 59, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          color: rgba(148, 163, 184, 0.9);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-button:hover {
          background: rgba(30, 41, 59, 0.5);
          border-color: rgba(148, 163, 184, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -8px rgba(148, 163, 184, 0.2);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: rgb(248, 113, 113);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        @keyframes logo-float {
          0%,
          100% {
            transform: translateY(0px) rotateY(0deg);
          }
          50% {
            transform: translateY(-10px) rotateY(180deg);
          }
        }

        @keyframes logo-glow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes clock-hour-slow {
          0% {
            transform: translateX(-50%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(-50%) translateY(-100%) rotate(405deg);
          }
        }

        @keyframes clock-minute-slow {
          0% {
            transform: translateX(-50%) translateY(-100%) rotate(180deg);
          }
          100% {
            transform: translateX(-50%) translateY(-100%) rotate(540deg);
          }
        }

        @keyframes float-geometric {
          0%,
          100% {
            transform: rotate(45deg) translateY(0px);
          }
          50% {
            transform: rotate(225deg) translateY(-15px);
          }
        }

        @keyframes float-circle {
          0%,
          100% {
            transform: scale(1) translateY(0px);
          }
          50% {
            transform: scale(1.1) translateY(-10px);
          }
        }

        @keyframes float-square {
          0%,
          100% {
            transform: rotate(12deg) translateY(0px);
          }
          50% {
            transform: rotate(192deg) translateY(-12px);
          }
        }

        @keyframes float-line {
          0%,
          100% {
            transform: translateX(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateX(20px) rotate(5deg);
            opacity: 1;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-float-geometric {
          animation: float-geometric 8s ease-in-out infinite;
        }

        .animate-float-circle {
          animation: float-circle 6s ease-in-out infinite;
        }

        .animate-float-square {
          animation: float-square 10s ease-in-out infinite;
        }

        .animate-float-line {
          animation: float-line 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
