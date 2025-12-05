import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

// Auth API
export const authAPI = {
  login: (credentials) => 
    axiosInstance.post(API_ENDPOINTS.LOGIN, credentials),
  
  register: (userData) => 
    axiosInstance.post(API_ENDPOINTS.REGISTER, userData),
  
  checkCode: (data) => 
    axiosInstance.post(API_ENDPOINTS.CHECK_CODE, data),
  
  retryActive: (email) => 
    axiosInstance.post(API_ENDPOINTS.RETRY_ACTIVE, { email }),
  
  retryPassword: (email) => 
    axiosInstance.post(API_ENDPOINTS.RETRY_PASSWORD, { email }),
  
  changePassword: (data) => 
    axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, data),
};

// User API
export const userAPI = {
  getAll: (params) => 
    axiosInstance.get(API_ENDPOINTS.USERS, { params }),
  
  search: (params) => 
    axiosInstance.get(API_ENDPOINTS.USER_SEARCH, { params }),
  
  getById: (id) => 
    axiosInstance.get(`${API_ENDPOINTS.USERS}/${id}`),
  
  create: (userData) => 
    axiosInstance.post(API_ENDPOINTS.USERS, userData),
  
  update: (userData) => 
    axiosInstance.patch(API_ENDPOINTS.USERS, userData),
  
  delete: (id) => 
    axiosInstance.delete(`${API_ENDPOINTS.USERS}/${id}`),
  
  migrateToElasticsearch: () => 
    axiosInstance.post(API_ENDPOINTS.USER_MIGRATE),
};
