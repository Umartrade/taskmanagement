import api from './index';
import { User, ApiResponse, PaginationInfo } from '../types';

export const getUsers = (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ users: User[]; pagination: PaginationInfo }>> => {
  return api.get(`/users?page=${page}&limit=${limit}`);
};

export const getUser = (id: string): Promise<ApiResponse<User>> => {
  return api.get(`/users/${id}`);
};

export const updateUser = (id: string, userData: any): Promise<ApiResponse<User>> => {
  return api.put(`/users/${id}`, userData);
};

export const deleteUser = (id: string): Promise<ApiResponse<void>> => {
  return api.delete(`/users/${id}`);
};

export const getLeaderboard = (limit: number = 10): Promise<ApiResponse<User[]>> => {
  return api.get(`/users/leaderboard?limit=${limit}`);
};