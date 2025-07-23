import api from './index';
import { Task, TaskFilters, TaskStats, ApiResponse, PaginationInfo } from '../types';

export const getTasks = (
  filters?: TaskFilters,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ tasks: Task[]; pagination: PaginationInfo }>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object') {
          // Handle nested objects like dueDate
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue) {
              params.append(`${key}.${nestedKey}`, nestedValue as string);
            }
          });
        } else {
          params.append(key, value as string);
        }
      }
    });
  }
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return api.get(`/tasks?${params.toString()}`);
};

export const getTask = (id: string): Promise<ApiResponse<Task>> => {
  return api.get(`/tasks/${id}`);
};

export const createTask = (taskData: any): Promise<ApiResponse<Task>> => {
  const formData = new FormData();
  
  Object.entries(taskData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
  });
  
  return api.post('/tasks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTask = (id: string, taskData: any): Promise<ApiResponse<Task>> => {
  const formData = new FormData();
  
  Object.entries(taskData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
  });
  
  return api.put(`/tasks/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTask = (id: string): Promise<ApiResponse<void>> => {
  return api.delete(`/tasks/${id}`);
};

export const assignTask = (id: string, assignedTo: string): Promise<ApiResponse<Task>> => {
  return api.post(`/tasks/${id}/assign`, { assignedTo });
};

export const getTaskStats = (): Promise<ApiResponse<TaskStats>> => {
  return api.get('/tasks/stats');
};