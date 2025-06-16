import React, { useState } from "react";

const RegistrationPage = () => {
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
        alert(
          "Registration successful! In a real app, this would redirect to login."
        );
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
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.1),transparent)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(148,163,184,0.08),transparent)] animate-pulse delay-1000"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-slate-400/20 to-slate-600/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-r from-slate-300/15 to-slate-500/15 rounded-full blur-xl animate-float-delay"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-slate-500/10 to-slate-700/10 rounded-full blur-xl animate-float-slow"></div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent leading-tight">
                Timer
                <span className="block text-slate-400">Studio</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-md mx-auto lg:mx-0">
                Experience the future of time management with our premium
                platform
              </p>
            </div>

            {/* Animated Clock */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-32 h-32 clock-container">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-300/20 to-slate-500/20 backdrop-blur-sm border border-slate-400/30 shadow-2xl">
                  <div className="absolute inset-4 rounded-full bg-slate-800/50 backdrop-blur border border-slate-300/20">
                    <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-slate-300 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full rotate-0 animate-clock-hour"></div>
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-slate-400 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full rotate-90 animate-clock-minute"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2">
            <div className="glass-card p-8 lg:p-12 max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-200 mb-2">
                  Create Account
                </h2>
                <p className="text-slate-400">Join the premium experience</p>
              </div>

              <div onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                  <label htmlFor="name" className="input-label">
                    Full Name
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="glass-input"
                      placeholder="Enter your full name"
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass-input"
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
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="glass-input"
                      placeholder="••••••••••"
                    />
                    <div className="input-focus-border"></div>
                  </div>
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
                      "Create Account"
                    )}
                  </span>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <button
                    onClick={() =>
                      alert("In a real app, this would navigate to login")
                    }
                    className="text-slate-300 hover:text-white transition-colors duration-300 underline decoration-slate-500 hover:decoration-slate-300 bg-transparent border-none cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
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

        .glass-input::placeholder {
          color: rgba(148, 163, 184, 0.5);
        }

        .glass-input:focus {
          border-color: rgba(148, 163, 184, 0.5);
          box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.1),
            0 8px 25px -8px rgba(148, 163, 184, 0.2);
          transform: translateY(-2px);
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

        .glass-input:focus + .input-focus-border {
          width: 100%;
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(90deg);
          }
        }

        @keyframes clock-hour {
          0% {
            transform: translateX(-50%) translateY(-100%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) translateY(-100%) rotate(360deg);
          }
        }

        @keyframes clock-minute {
          0% {
            transform: translateX(-50%) translateY(-100%) rotate(90deg);
          }
          100% {
            transform: translateX(-50%) translateY(-100%) rotate(450deg);
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

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-clock-hour {
          animation: clock-hour 43200s linear infinite;
        }

        .animate-clock-minute {
          animation: clock-minute 3600s linear infinite;
        }

        @media (max-width: 1024px) {
          .glass-card {
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;
