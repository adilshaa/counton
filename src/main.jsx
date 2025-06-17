import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'; // Import ClerkProvider
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import App from './App.jsx';

// IMPORTANT: Replace "YOUR_CLERK_PUBLISHABLE_KEY" with your actual Publishable Key from the Clerk Dashboard.
const CLERK_PUBLISHABLE_KEY = "YOUR_CLERK_PUBLISHABLE_KEY";

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}> {/* ClerkProvider wraps BrowserRouter */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
