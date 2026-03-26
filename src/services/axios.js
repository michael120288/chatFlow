import axios from 'axios';
import logger from '@services/utils/logger';

export const BASE_ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    // If we get a 401 and we're logging out, don't throw the error
    if (status === 401 && url === '/signout') {
      return Promise.resolve({ data: { message: 'Logged out successfully' } });
    }
    logger.error(`← ${status ?? 'ERR'} ${url}`, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
