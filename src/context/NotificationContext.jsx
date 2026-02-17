import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper function to format relative time
const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(timestamp).toLocaleDateString();
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If it's an empty array, return it (user cleared all notifications)
      if (Array.isArray(parsed) && parsed.length === 0) {
        return [];
      }
      // Ensure all notifications have timestamps
      return parsed.map(notif => ({
        ...notif,
        timestamp: notif.timestamp || Date.now() - (notif.id * 3600000), // Fallback for old notifications
      }));
    }
    // Default notifications with timestamps (only on first visit)
    const now = Date.now();
    return [
      {
        id: 1,
        type: "wishlist",
        title: "New items in your wishlist",
        message: "Check out new products similar to items in your wishlist",
        timestamp: now - (2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: 2,
        type: "price",
        title: "Price drop alert",
        message: "A product you viewed has a new discount available",
        timestamp: now - (5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
      },
      {
        id: 3,
        type: "order",
        title: "Order update",
        message: "Your order has been confirmed and is being processed",
        timestamp: now - (24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
      {
        id: 4,
        type: "general",
        title: "Welcome to Campus Katale",
        message: "Start exploring our marketplace for the best deals on campus",
        timestamp: now - (3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
      },
    ];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        markAllAsRead,
        clearAllNotifications,
        unreadCount,
        setNotifications,
        formatRelativeTime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
