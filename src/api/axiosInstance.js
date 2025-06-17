import axios from 'axios';
// Attempt to import the clerk instance. This might vary based on Clerk's SDK version and how it's initialized.
// If this direct import doesn't work, window.Clerk would be the fallback.
import { clerk } from '@clerk/clerk-react';

const API_BASE_URL = 'http://localhost:3000'; // Or your actual API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add Clerk token to Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Check if Clerk is loaded and there's an active session
      // The exact way to access the session and token might depend on Clerk's version and initialization.
      // Prioritize using the imported 'clerk' instance if available.
      let token;
      if (clerk && typeof clerk.session?.getToken === 'function') { // clerk instance from import
        token = await clerk.session.getToken();
      } else if (window.Clerk && typeof window.Clerk.session?.getToken === 'function') { // Fallback to window.Clerk
        // console.warn("Using window.Clerk to get session token. Ensure Clerk is initialized before API calls.");
        token = await window.Clerk.session.getToken();
      } else {
        // console.log("Clerk session or getToken function not available.");
      }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving Clerk token:", error);
      // Decide if you want to let the request proceed without a token or handle error differently
      // For example, you might want to reject the promise if token is crucial:
      // return Promise.reject(new Error("Failed to retrieve auth token."));
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
