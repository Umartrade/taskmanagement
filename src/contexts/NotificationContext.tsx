import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as notificationApi from '../api/notifications';
import { Notification, PaginationInfo } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
}

interface NotificationContextType extends NotificationState {
  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationAction =
  | { type: 'NOTIFICATION_START' }
  | { type: 'FETCH_NOTIFICATIONS_SUCCESS'; payload: { notifications: Notification[]; pagination: PaginationInfo } }
  | { type: 'FETCH_UNREAD_COUNT_SUCCESS'; payload: number }
  | { type: 'MARK_AS_READ_SUCCESS'; payload: string }
  | { type: 'MARK_ALL_AS_READ_SUCCESS' }
  | { type: 'NOTIFICATION_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'NOTIFICATION_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        notifications: action.payload.notifications,
        pagination: action.payload.pagination,
        error: null
      };
    case 'FETCH_UNREAD_COUNT_SUCCESS':
      return { ...state, unreadCount: action.payload };
    case 'MARK_AS_READ_SUCCESS':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ_SUCCESS':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString()
        })),
        unreadCount: 0
      };
    case 'NOTIFICATION_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const fetchNotifications = useCallback(async (page: number = 1) => {
    dispatch({ type: 'NOTIFICATION_START' });
    try {
      const response = await notificationApi.getNotifications(page);
      dispatch({
        type: 'FETCH_NOTIFICATIONS_SUCCESS',
        payload: {
          notifications: response.data.notifications,
          pagination: response.data.pagination
        }
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch notifications';
      dispatch({ type: 'NOTIFICATION_ERROR', payload: message });
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      dispatch({ type: 'FETCH_UNREAD_COUNT_SUCCESS', payload: response.data.count });
    } catch (error: any) {
      // Silently fail for unread count
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      dispatch({ type: 'MARK_AS_READ_SUCCESS', payload: id });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to mark as read';
      dispatch({ type: 'NOTIFICATION_ERROR', payload: message });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      dispatch({ type: 'MARK_ALL_AS_READ_SUCCESS' });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to mark all as read';
      dispatch({ type: 'NOTIFICATION_ERROR', payload: message });
    }
  }, []);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        clearError
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};