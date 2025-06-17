import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      {/* Gradient Waves */}
      <div className="gradient-waves">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>

      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <style jsx>{`
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
          overflow: hidden;
          z-index: -1; /* Ensures it stays in the background */
        }

        /* Gradient Waves */
        .gradient-waves {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(60, 60, 60, 0.1) 50%, transparent 70%);
          animation: wave-motion 20s linear infinite;
        }

        .wave-1 {
          top: -50%;
          left: -50%;
          animation-delay: 0s;
        }

        .wave-2 {
          top: -50%;
          left: -50%;
          animation-delay: -7s;
          animation-duration: 25s;
        }

        .wave-3 {
          top: -50%;
          left: -50%;
          animation-delay: -14s;
          animation-duration: 30s;
        }

        @keyframes wave-motion {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        /* Particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(120, 120, 120, 0.6);
          border-radius: 50%;
          animation: particle-float 15s linear infinite;
        }

        /* Particle positions and delays (example) */
        .particle-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .particle-2 { top: 20%; left: 15%; animation-delay: -2s; }
        .particle-3 { top: 30%; left: 25%; animation-delay: -4s; }
        .particle-4 { top: 40%; left: 35%; animation-delay: -6s; }
        .particle-5 { top: 50%; left: 45%; animation-delay: -8s; }
        .particle-6 { top: 60%; left: 55%; animation-delay: -10s; }
        .particle-7 { top: 70%; left: 65%; animation-delay: -12s; }
        .particle-8 { top: 80%; left: 75%; animation-delay: -14s; }
        .particle-9 { top: 15%; left: 85%; animation-delay: -1s; }
        .particle-10 { top: 25%; left: 95%; animation-delay: -3s; }
        .particle-11 { top: 35%; left: 10%; animation-delay: -5s; }
        .particle-12 { top: 45%; left: 20%; animation-delay: -7s; }
        .particle-13 { top: 55%; left: 30%; animation-delay: -9s; }
        .particle-14 { top: 65%; left: 40%; animation-delay: -11s; }
        .particle-15 { top: 75%; left: 50%; animation-delay: -13s; }
        .particle-16 { top: 85%; left: 60%; animation-delay: -15s; }
        .particle-17 { top: 5%; left: 70%; animation-delay: -2.5s; }
        .particle-18 { top: 95%; left: 80%; animation-delay: -4.5s; }
        .particle-19 { top: 12%; left: 90%; animation-delay: -6.5s; }
        .particle-20 { top: 88%; left: 8%; animation-delay: -8.5s; }

        @keyframes particle-float {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        /* Subtle pulsing overlay */
        .animated-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(80, 80, 80, 0.1) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
