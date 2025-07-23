import api from './index';
import { Notification, ApiResponse, PaginationInfo } from '../types';

export const getNotifications = (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<ApiResponse<{ notifications: Notification[]; pagination: PaginationInfo }>> => {
  return api.get(`/users/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
};

export const getUnreadCount = (): Promise<ApiResponse<{ count: number }>> => {
  return api.get('/users/notifications/unread-count');
};

export const markAsRead = (id: string): Promise<ApiResponse<Notification>> => {
  return api.post(`/users/notifications/${id}/read`);
};

export const markAllAsRead = (): Promise<ApiResponse<void>> => {
  return api.post('/users/notifications/mark-all-read');
};

export const deleteNotification = (id: string): Promise<ApiResponse<void>> => {
  return api.delete(`/users/notifications/${id}`);
};