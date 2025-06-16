// src/contexts/AuthContext.jsx
// IMPORTANT SECURITY NOTICE:
// The authentication mechanism implemented in this context is for
// DEMONSTRATION AND EDUCATIONAL PURPOSES ONLY.
// It uses local storage for user data, including storing passwords
// in plain text, which is HIGHLY INSECURE and NOT SUITABLE for
// production environments or any real-world application.
// Always handle passwords securely on a backend server with proper hashing.
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }), // 'name' is not sent
      });

      const data = await response.json(); // Attempt to parse JSON regardless of response.ok for error messages

      if (response.ok) { // Status 201 for successful registration
        // Backend automatically logs in, set user state
        // Assuming 'email' (which is the username) and 'data.userId' are available
        // The 'name' variable from the function arguments isn't directly available in 'data' from backend
        // We might need to adjust what's stored in currentUser based on what backend provides or what frontend needs.
        // For now, let's store id and the email (as username).
        setCurrentUser({ id: data.userId, email: email }); // Storing email as it's our representation of username
        setIsAuthenticated(true);
        return { success: true, message: data.message || 'Registration successful!' };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (error) {
      console.error('Registration API error:', error);
      return { success: false, message: error.message || 'Network error or other issue during registration.' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json(); // Attempt to parse JSON regardless of response.ok

      if (response.ok) { // Status 200 for successful login
        // Backend confirms login, set user state
        // Assuming 'email' (which is the username) and 'data.userId' are available
        setCurrentUser({ id: data.userId, email: email }); // Storing email as it's our representation of username
        setIsAuthenticated(true);
        return { success: true, message: data.message || 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, message: error.message || 'Network error or other issue during login.' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Send empty JSON object
      });

      if (!response.ok) {
        console.warn('Backend logout request failed or did not return OK status.');
      }

    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      // localStorage.removeItem(SESSION_USER_STORAGE_KEY); // Not needed with HTTP-only cookies
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
