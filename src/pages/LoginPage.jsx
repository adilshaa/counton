import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        {/* You can add custom headings, text, or layout around the SignIn component */}
        {/* <h1>Login to Your Account</h1> */}
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/register"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
};

export default LoginPage;
