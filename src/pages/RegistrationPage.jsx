import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import AnimatedBackground from '../components/AnimatedBackground'; // Import AnimatedBackground

const RegistrationPage = () => {
  return (
    <> {/* Use a fragment */}
      <AnimatedBackground />
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'relative',
          zIndex: 1
      }}>
        <div>
          {/* Optional: <h1 style={{ color: 'white' }}>Create Your Account</h1> */}
          <SignUp
            path="/register"
            routing="path"
            signInUrl="/login"
            afterSignUpUrl="/"
          />
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
