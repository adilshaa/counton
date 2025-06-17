import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const ACCESS_TOKEN_KEY = 'accessToken'; // Key for storing access token in localStorage
const REFRESH_TOKEN_KEY = 'refreshToken'; // Key for storing refresh token in localStorage

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Variable to hold the refresh token promise
let isRefreshing = false;
// Array to hold all the subscribers that are waiting for the new token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401/403 and not a retry request and not the refresh token URL itself
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {

      if (isRefreshing) {
        // If currently refreshing, queue the original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err); // Critical: This ensures the subsequent .catch of the original call is triggered
        });
      }

      originalRequest._retry = true; // Mark it as a retry
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!storedRefreshToken) {
          console.log('No refresh token found for refresh attempt.');
          localStorage.removeItem(ACCESS_TOKEN_KEY); // Clear access token too
          processQueue(new Error('No refresh token available.'), null);
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token available.'));
        }

        console.log('Attempting to refresh token with client-side token...');
        // Use axios.post to avoid interceptor loop for this specific call
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken } // Send storedRefreshToken in body
          // No withCredentials: true needed here anymore
        );

        // Backend now returns new accessToken AND new refreshToken
        if (refreshResponse.status === 200 && refreshResponse.data.accessToken && refreshResponse.data.refreshToken) {
          const newAccessToken = refreshResponse.data.accessToken;
          const newRefreshToken = refreshResponse.data.refreshToken; // Get new refresh token

          console.log('Token refreshed successfully. New AT and RT received.');
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken); // Store new refresh token.

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } else {
          console.error('Refresh token response not OK or missing new tokens.');
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          processQueue(new Error('Failed to refresh token (unexpected response).'), null);
          window.location.href = '/login';
          return Promise.reject(new Error('Failed to refresh token (unexpected response).'));
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        processQueue(refreshError, null);

        if (refreshError.response && (refreshError.response.status === 401 || refreshError.response.status === 403)) {
          console.log('Refresh token is invalid or expired. Redirecting to login.');
        }
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // For errors not related to 401/403 or if it's a retry that failed again
    return Promise.reject(error);
  }
);

export default axiosInstance;
