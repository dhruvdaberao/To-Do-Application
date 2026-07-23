import axios from 'axios';
import { getToken } from '../utils/tokenManager';
import { API_ENDPOINTS } from '../constants';

// For Android Emulator to access local backend, 10.0.2.2 is usually required
// For iOS Simulator, localhost is fine. We will use a typical fallback.
const BASE_URL = 'http://10.0.2.2:3000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);
