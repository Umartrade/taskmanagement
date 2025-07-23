import React, { createContext, useContext, useReducer, useCallback } from 'react';
import * as taskApi from '../api/tasks';
import { Task, TaskFilters, PaginationInfo } from '../types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  stats: any;
}

interface TaskContextType extends TaskState {
  fetchTasks: (filters?: TaskFilters, page?: number) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (id: string, taskData: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
  clearCurrentTask: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type TaskAction =
  | { type: 'TASK_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: { tasks: Task[]; pagination: PaginationInfo } }
  | { type: 'FETCH_TASK_SUCCESS'; payload: Task }
  | { type: 'CREATE_TASK_SUCCESS'; payload: Task }
  | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
  | { type: 'DELETE_TASK_SUCCESS'; payload: string }
  | { type: 'FETCH_STATS_SUCCESS'; payload: any }
  | { type: 'TASK_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_CURRENT_TASK' };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'TASK_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        error: null
      };
    case 'FETCH_TASK_SUCCESS':
      return { ...state, loading: false, currentTask: action.payload, error: null };
    case 'CREATE_TASK_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: [action.payload, ...state.tasks],
        error: null
      };
    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        currentTask: action.payload,
        error: null
      };
    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        error: null
      };
    case 'FETCH_STATS_SUCCESS':
      return { ...state, loading: false, stats: action.payload, error: null };
    case 'TASK_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_CURRENT_TASK':
      return { ...state, currentTask: null };
    default:
      return state;
  }
};

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: null,
  stats: null
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filters?: TaskFilters, page: number = 1) => {
    dispatch({ type: 'TASK_START' });
    try {
      const response = await taskApi.getTasks(filters, page);
      dispatch({
        type: 'FETCH_TASKS_SUCCESS',
        payload: {
          tasks: response.data.tasks,
          pagination: response.data.pagination
        }
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch tasks';
      dispatch({ type: 'TASK_ERROR', payload: message });
    }
  }, []);

  const fetchTask = useCallback(async (id: string) => {
    dispatch({ type: 'TASK_START' });
    try {
      const response = await taskApi.getTask(id);
      dispatch({ type: 'FETCH_TASK_SUCCESS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch task';
      dispatch({ type: 'TASK_ERROR', payload: message });
    }
  }, []);

  const createTask = useCallback(async (taskData: any) => {
    dispatch({ type: 'TASK_START' });
    try {
      const response = await taskApi.createTask(taskData);
      dispatch({ type: 'CREATE_TASK_SUCCESS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: any) => {
    dispatch({ type: 'TASK_START' });
    try {
      const response = await taskApi.updateTask(id, taskData);
      dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    dispatch({ type: 'TASK_START' });
    try {
      await taskApi.deleteTask(id);
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete task';
      dispatch({ type: 'TASK_ERROR', payload: message });
      throw error;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await taskApi.getTaskStats();
      dispatch({ type: 'FETCH_STATS_SUCCESS', payload: response.data });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch stats';
      dispatch({ type: 'TASK_ERROR', payload: message });
    }
  }, []);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearCurrentTask = () => {
    dispatch({ type: 'CLEAR_CURRENT_TASK' });
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        deleteTask,
        fetchStats,
        clearError,
        clearCurrentTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};