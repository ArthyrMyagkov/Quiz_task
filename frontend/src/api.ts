import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fvx407wv-5000.euw.devtunnels.ms/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
