import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'superadmin') {
      fetchNotifications();
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      
      // Update unread count
      const unreadResponse = await api.get('/notifications/unread-count');
      setUnreadCount(unreadResponse.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          isRead: true, 
          readAt: new Date().toISOString() 
        }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count if notification was unread
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Super Admin functions
  const fetchSystemNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/system/all');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch system notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSystemNotification = async (notificationData) => {
    try {
      const response = await api.post('/notifications/system', notificationData);
      await fetchSystemNotifications(); // Refresh the list
      return { success: true, notification: response.data.notification };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create notification';
      return { success: false, error: message };
    }
  };

  const updateSystemNotification = async (notificationId, updateData) => {
    try {
      const response = await api.put(`/notifications/system/${notificationId}`, updateData);
      await fetchSystemNotifications(); // Refresh the list
      return { success: true, notification: response.data.notification };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update notification';
      return { success: false, error: message };
    }
  };

  const deactivateSystemNotification = async (notificationId) => {
    try {
      await api.patch(`/notifications/system/${notificationId}/deactivate`);
      await fetchSystemNotifications(); // Refresh the list
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to deactivate notification';
      return { success: false, error: message };
    }
  };

  const deleteSystemNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/system/${notificationId}`);
      await fetchSystemNotifications(); // Refresh the list
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete notification';
      return { success: false, error: message };
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Super Admin functions
    fetchSystemNotifications,
    createSystemNotification,
    updateSystemNotification,
    deactivateSystemNotification,
    deleteSystemNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
