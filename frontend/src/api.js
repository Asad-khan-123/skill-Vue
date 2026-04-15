import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const api = axios.create({
  // In development, the backend is on port 8000. In production, it serves the frontend from same origin.
  baseURL: import.meta.env.VITE_API_BASE_URL || (isDev ? 'http://localhost:8000/api' : '/api'), 
  withCredentials: true,
});

// We can add auth token interceptors here if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
