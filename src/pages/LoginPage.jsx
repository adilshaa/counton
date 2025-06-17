import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import AnimatedBackground from '../components/AnimatedBackground'; // Import AnimatedBackground

const LoginPage = () => {
  return (
    <> {/* Use a fragment to allow sibling elements: AnimatedBackground and the content div */}
      <AnimatedBackground />
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'relative', /* Ensure this div is positioned relative for z-index context if needed, though not strictly necessary if AnimatedBackground is z-index: -1 */
          zIndex: 1 /* Ensure content is above background, though default flow should also achieve this */
      }}>
        <div>
          {/* Optional: h1 style={{ color: 'white' }}>Login to Your Account</h1> */}
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/register"
            afterSignInUrl="/"
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
