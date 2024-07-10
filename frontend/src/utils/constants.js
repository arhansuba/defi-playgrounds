// constants.js
export const API_URL = 'https://your-backend-api.com/api';
export const API_TIMEOUT = 10000; // 10 seconds

export const LOCAL_STORAGE_TOKEN_KEY = 'token';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  REGISTRATION_FAILED: 'Registration failed',
  API_ERROR: 'API error',
};

export const TOAST_OPTIONS = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};