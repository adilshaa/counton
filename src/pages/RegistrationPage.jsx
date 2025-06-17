import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const RegistrationPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        {/* You can add custom headings, text, or layout around the SignUp component */}
        {/* <h1>Create Your Account</h1> */}
        <SignUp
          path="/register"
          routing="path"
          signInUrl="/login"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
};

export default RegistrationPage;
