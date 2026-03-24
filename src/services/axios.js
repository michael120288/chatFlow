import axios from 'axios';

export const BASE_ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 and we're logging out, don't throw the error
    if (error.response?.status === 401 && error.config?.url === '/signout') {
      return Promise.resolve({ data: { message: 'Logged out successfully' } });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
