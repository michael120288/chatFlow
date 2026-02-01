import axios from 'axios';

export let BASE_ENDPOINT = '';

// when developing locally, change this value to local
export const APP_ENVIRONMENT = 'local';

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'https://api.dev.<your-backend-domain>';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://api.stg.<your-backend-domain>';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = 'https://api.<your-backend-domain>';
}

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
