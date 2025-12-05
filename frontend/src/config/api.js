// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CHECK_CODE: '/auth/check-code',
  RETRY_ACTIVE: '/auth/retry-active',
  RETRY_PASSWORD: '/auth/retry-password',
  CHANGE_PASSWORD: '/auth/change-password',
  
  // User endpoints
  USERS: '/users',
  USER_SEARCH: '/users/search',
  USER_MIGRATE: '/users/migrate-to-elasticsearch',
};
