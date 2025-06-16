// src/contexts/AuthContext.jsx
// IMPORTANT SECURITY NOTICE:
// The authentication mechanism implemented in this context is for
// DEMONSTRATION AND EDUCATIONAL PURPOSES ONLY.
// It uses local storage for user data, including storing passwords
// in plain text, which is HIGHLY INSECURE and NOT SUITABLE for
// production environments or any real-world application.
// Always handle passwords securely on a backend server with proper hashing.
// Remove useEffect import if not used elsewhere, but it might be needed for session check effect later.
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Import axiosInstance

const AuthContext = createContext(null);
const ACCESS_TOKEN_KEY = 'accessToken';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial session check

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true); // Explicitly set loading true at the start of this async op
      // const existingToken = localStorage.getItem(ACCESS_TOKEN_KEY); // existingToken check removed as per plan

      try {
        console.log('Attempting to refresh token on initial load...');
        const refreshResponse = await axiosInstance.post('/auth/refresh-token', {});

        if (refreshResponse.data && refreshResponse.data.accessToken) {
          console.log('Initial refresh successful, fetching user data...');
          try {
            const userResponse = await axiosInstance.get('/auth/me');
            if (userResponse.data) {
              setSession(localStorage.getItem(ACCESS_TOKEN_KEY), userResponse.data);
            } else {
              clearSession();
            }
          } catch (userError) {
            console.error('Failed to fetch user data after initial refresh:', userError);
            clearSession();
          }
        } else {
          console.log('Initial refresh did not return access token.');
          clearSession();
        }
      } catch (error) {
        console.log('Initial token refresh failed:', error.message);
        clearSession();
      }
      // setIsLoading(false); // isLoading is set by setSession/clearSession
    };

    initializeAuth();
  }, []); // Empty dependency array ensures it runs once on mount

  // Helper function to set session
  const setSession = (accessToken, userData) => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      // Update axiosInstance defaults if needed, though interceptor should handle new requests
      // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      // delete axiosInstance.defaults.headers.common['Authorization'];
    }

    if (userData) {
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Helper function to clear session
  const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    // delete axiosInstance.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // Placeholder/stub functions for register, login, logout
  // These will be fully implemented in subsequent steps using axiosInstance and setSession/clearSession
  const register = async (name, email, password) => {
    // setIsLoading(true); // Optional: manage loading state for this specific action
    try {
      const response = await axiosInstance.post('/auth/register', {
        username: email, // Send email as username
        password: password,
      });

      if (response.data && response.data.accessToken && response.data.user) {
        setSession(response.data.accessToken, response.data.user);
        return { success: true, message: response.data.message || 'Registration successful!' };
      } else {
        // Should not happen if backend adheres to spec and status is 201
        clearSession(); // Ensure inconsistent state is not set
        return { success: false, message: 'Registration completed but response was unexpected.' };
      }
    } catch (error) {
      clearSession(); // Ensure session is cleared on any registration error
      let errorMessage = 'Registration failed due to an unexpected error.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    } finally {
       // setIsLoading(false); // Manage loading state if set at the beginning
    }
  };

  const login = async (email, password) => {
    // setIsLoading(true); // Optional: manage loading state for this specific action
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: email, // Send email as username
        password: password,
      });

      if (response.data && response.data.accessToken && response.data.user) {
        setSession(response.data.accessToken, response.data.user);
        return { success: true, message: response.data.message || 'Login successful!' };
      } else {
        // Should not happen if backend adheres to spec and status is 200
        clearSession();
        return { success: false, message: 'Login completed but response was unexpected.' };
      }
    } catch (error) {
      clearSession();
      let errorMessage = 'Login failed due to an unexpected error.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return { success: false, message: errorMessage };
    } finally {
      // setIsLoading(false); // Manage loading state if set at the beginning
    }
  };

  const logout = async () => {
    // setIsLoading(true); // Optional
    try {
      // Call the backend to invalidate the session/refresh token cookie
      // No specific data needs to be sent in the body for this logout endpoint.
      // axiosInstance will automatically include the Authorization header with the access token,
      // though it's typically not required for a logout endpoint.
      // The main purpose is to hit the endpoint so server can clear HttpOnly refresh token cookie.
      await axiosInstance.post('/auth/logout', {}); // Sending empty object as body
    } catch (error) {
      // Log the error but proceed to clear client-side session anyway
      console.error('Error during backend logout:', error);
    } finally {
      clearSession(); // Always clear frontend session
      // setIsLoading(false); // Optional
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, isLoading, register, login, logout, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
