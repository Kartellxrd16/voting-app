'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser, userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    const audio = new Audio('/sounds/notification.mp3'); // You'll need to add this sound file
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!currentUser || !userData) return;
    
    setIsLoading(true);
    try {
      const userType = userData.role === 'admin' || userData.role === 'officer' ? 'admin' : 'student';
      const userId = userData.role === 'admin' ? 'admin' : userData.studentId;
      
      const response = await fetch(`http://localhost:8000/api/notifications/${userId}?user_type=${userType}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        
        // Calculate unread count
        const unread = data.filter(notif => !notif.is_read).length;
        setUnreadCount(unread);
        
        // Play sound if new notifications arrived
        if (unread > 0 && data.length > notifications.length) {
          playNotificationSound();
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      // Mark each unread notification as read
      await Promise.all(
        unreadNotifications.map(notif => 
          fetch(`http://localhost:8000/api/notifications/${notif.id}/read`, {
            method: 'PUT'
          })
        )
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const wasUnread = notifications.find(notif => notif.id === notificationId && !notif.is_read);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Poll for new notifications (real-time updates)
  useEffect(() => {
    if (!currentUser) return;
    
    fetchNotifications(); // Initial fetch
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [currentUser, userData]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    playNotificationSound
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}