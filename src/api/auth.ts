import api from './index';
import { User, ApiResponse } from '../types';

export const register = (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
  return api.post('/auth/register', userData);
};

export const login = (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
  return api.post('/auth/login', credentials);
};

export const getCurrentUser = (): Promise<User> => {
  return api.get('/auth/me').then(response => response.data.data);
};

export const refreshToken = (): Promise<ApiResponse<{ user: User; token: string }>> => {
  return api.post('/auth/refresh');
};