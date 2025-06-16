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

  const USERS_STORAGE_KEY = 'timerAppUsers';
  const SESSION_USER_STORAGE_KEY = 'timerAppSessionUser';

  useEffect(() => {
    try {
      const sessionUser = localStorage.getItem(SESSION_USER_STORAGE_KEY);
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error parsing session user from local storage:", error);
      localStorage.removeItem(SESSION_USER_STORAGE_KEY); // Clear corrupted data
    }
  }, []);

  const register = async (name, email, password) => {
    // IMPORTANT: Storing passwords in local storage is INSECURE. This is for demonstration only.
    try {
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
      if (existingUsers.find(user => user.email === email)) {
        return { success: false, message: 'Email already exists.' };
      }
      // SECURITY WARNING: Storing plain text passwords in local storage is a major security risk.
      // This implementation is for demonstration purposes only.
      // In a real application, passwords should be hashed securely on a backend.
      const newUser = { name, email, password }; // Storing password directly (INSECURE)
      existingUsers.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
      const user = existingUsers.find(u => u.email === email);

      // SECURITY WARNING: Comparing plain text passwords is a major security risk.
      // This check is against a password stored insecurely in local storage.
      // This implementation is for demonstration purposes only.
      if (user && user.password === password) {
        const sessionUser = { name: user.name, email: user.email }; // Do not store password in session/currentUser
        setCurrentUser(sessionUser);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_USER_STORAGE_KEY, JSON.stringify(sessionUser));
        return { success: true, message: 'Login successful!' };
      }
      return { success: false, message: 'Invalid email or password.' };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_USER_STORAGE_KEY);
    // Optionally, could also clear USERS_STORAGE_KEY if desired for a full reset,
    // but typically you'd keep user accounts.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
