// utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://your-backend-api.com/api'; // replace with your backend API URL
const API_TIMEOUT = 10000; // 10 seconds

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set API token (if using authentication)
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// API endpoints
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    console.error(error);
    toast.error('Invalid username or password');
    return null;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    console.error(error);
    toast.error('Registration failed');
    return null;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to retrieve profile');
    return null;
  }
};

export const createPost = async (title, content) => {
  try {
    const response = await api.post('/posts', { title, content });
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to create post');
    return null;
  }
};

export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to retrieve posts');
    return null;
  }
};

export const updatePost = async (id, title, content) => {
  try {
    const response = await api.patch(`/posts/${id}`, { title, content });
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to update post');
    return null;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete post');
    return null;
  }
};

// Error handling
api.interceptors.push({
  responseError: (error) => {
    console.error(error);
    toast.error('API error');
    return Promise.reject(error);
  },
});

// Token refresh
api.interceptors.push({
  request: (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  response: (response) => {
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
});

// API request logging
api.interceptors.push({
  request: (config) => {
    console.log(`API request: ${config.method} ${config.url}`);
    return config;
  },
  response: (response) => {
    console.log(`API response: ${response.status} ${response.statusText}`);
    return response;
  },
});