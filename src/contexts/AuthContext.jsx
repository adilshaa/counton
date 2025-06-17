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
const REFRESH_TOKEN_KEY = 'refreshToken';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial session check

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (storedRefreshToken) {
        try {
          console.log('Attempting to refresh token on initial load using stored RT...');
          // The axiosInstance response interceptor might handle storing new tokens if this call
          // itself doesn't directly use the response. But this call is to get the initial AT.
          // The interceptor won't run for this specific call if it's successful (not 401/403).
          // So, we need to handle the response from refresh-token directly here.

          const refreshResponse = await axiosInstance.post('/auth/refresh-token', {
            refreshToken: storedRefreshToken
          });

          if (refreshResponse.data && refreshResponse.data.accessToken && refreshResponse.data.refreshToken) {
            const newAccessToken = refreshResponse.data.accessToken;
            const newRefreshToken = refreshResponse.data.refreshToken;

            // Explicitly store new tokens from this refresh call
            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

            console.log('Initial refresh successful, fetching user data...');
            try {
              // axiosInstance will now use the newAccessToken from localStorage via its request interceptor
              const userResponse = await axiosInstance.get('/auth/me');
              if (userResponse.data) {
                // Pass all three items to setSession
                setSession(newAccessToken, newRefreshToken, userResponse.data);
              } else {
                // Unlikely if /auth/me is successful but returns no data
                clearSession();
              }
            } catch (userError) {
              console.error('Failed to fetch user data after initial refresh:', userError);
              clearSession();
            }
          } else {
            // Refresh response was OK, but didn't contain expected tokens
            console.log('Initial refresh response OK, but missing new tokens.');
            clearSession();
          }
        } catch (error) {
          // This catch handles errors from the /auth/refresh-token call itself
          // (e.g., network error, or backend returns 401/403 if refresh token is invalid)
          console.log('Initial token refresh failed:', error.message);
          clearSession(); // This is important if refresh token is invalid
        }
      } else {
        // No stored refresh token
        console.log('No refresh token found on initial load.');
        clearSession(); // This also sets isLoading = false
      }
      // setIsLoading(false); // isLoading is now set by setSession/clearSession
    };

    initializeAuth();
  }, []); // Empty dependency array ensures it runs once on mount

  // Helper function to set session
  const setSession = (accessToken, refreshToken, userData) => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    if (refreshToken) { // New: Handle refreshToken
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    if (userData && accessToken && refreshToken) { // Be stricter: need all for a valid session
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } else {
      // If essential parts are missing, treat as no session
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(ACCESS_TOKEN_KEY); // Ensure cleanup
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    setIsLoading(false);
  };

  // Helper function to clear session
  const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY); // New: Remove refreshToken
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

      if (response.data && response.data.accessToken && response.data.refreshToken && response.data.user) {
        // The backend is expected to return accessToken, refreshToken, and user object upon successful registration
        setSession(response.data.accessToken, response.data.refreshToken, response.data.user);
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

      if (response.data && response.data.accessToken && response.data.refreshToken && response.data.user) {
        // The backend is expected to return accessToken, refreshToken, and user object upon successful login
        setSession(response.data.accessToken, response.data.refreshToken, response.data.user);
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
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    // setIsLoading(true); // Optional
    try {
      // Call the backend to invalidate the session/refresh token cookie
      // No specific data needs to be sent in the body for this logout endpoint.
      // axiosInstance will automatically include the Authorization header with the access token,
      // though it's typically not required for a logout endpoint.
      // The main purpose is to hit the endpoint so server can clear HttpOnly refresh token cookie.
      await axiosInstance.post('/auth/logout', { refreshToken: storedRefreshToken }); // New call
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
