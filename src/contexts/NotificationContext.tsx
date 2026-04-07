import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Notification } from '@/types';
import { mockNotifications, getNotificationsByUser } from '@/data/mockData';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode; userId?: string }> = ({ 
  children, 
  userId 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (userId) {
      return getNotificationsByUser(userId);
    }
    return [];
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    mockNotifications.unshift(newNotification);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications[index].isRead = true;
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    mockNotifications.forEach(n => {
      if (notifications.some(notif => notif.id === n.id)) {
        n.isRead = true;
      }
    });
  }, [notifications]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
  }, []);

  // Update notifications when userId changes
  React.useEffect(() => {
    if (userId) {
      setNotifications(getNotificationsByUser(userId));
    } else {
      setNotifications([]);
    }
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
