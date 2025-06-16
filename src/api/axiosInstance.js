import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const ACCESS_TOKEN_KEY = 'accessToken'; // Key for storing access token in localStorage

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
        console.log('Attempting to refresh token...');
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true // Ensures HttpOnly cookie is sent cross-origin
        });

        if (refreshResponse.status === 200 && refreshResponse.data.accessToken) {
          const newAccessToken = refreshResponse.data.accessToken;
          console.log('Token refreshed successfully.');
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // Update default for subsequent calls
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Update current request

          processQueue(null, newAccessToken); // Process queued requests with new token
          return axiosInstance(originalRequest); // Retry original request
        } else {
          // Refresh token failed (e.g. not 200 OK or no access token)
          console.error('Refresh token response not OK or no new access token.');
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          processQueue(new Error('Failed to refresh token.'), null);
          window.location.href = '/login'; // Redirect to login
          return Promise.reject(new Error('Failed to refresh token.'));
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        processQueue(refreshError, null); // Process queued requests with error
        // Check if the error is from the API (e.g. refresh token invalid) or network
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
