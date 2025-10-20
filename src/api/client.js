import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.mobinhost.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mobinhost-erp-token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || 'Unexpected server error';
    return Promise.reject(new Error(message));
  }
);

export default client;
