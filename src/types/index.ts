export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  stats: {
    tasksCreated: number;
    tasksCompleted: number;
    tasksAssigned: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  completionRate?: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  image?: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
  createdBy: User;
  assignedTo?: User;
  tags?: string[];
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: 'task_assigned' | 'task_updated' | 'task_completed' | 'task_overdue';
  title: string;
  message: string;
  relatedTask?: Task;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  overdue?: boolean;
  dueDate?: {
    from?: string;
    to?: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  high: number;
  medium: number;
  low: number;
  overdue: number;
}