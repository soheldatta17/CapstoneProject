import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_BASE = `${BASE_URL}/api`;
export { BASE_URL };

export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
