import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Depending on ENV, but for now hardcoded 5000 as per backend setup
  withCredentials: true, // If we ever stick cookies in
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
