import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Helper component to access NotificationContext
const WishlistProviderInner = ({ children }) => {
  const { addNotification, notifications } = useNotifications();
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prev) => {
      // Check if item already exists
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      
      const newWishlist = [...prev, item];
      
      // Check if there's already a recent wishlist notification (within last hour)
      // If not, add a general reminder notification
      const recentWishlistNotification = notifications.find(
        (notif) => 
          notif.type === "wishlist" && 
          notif.title === "New items in your wishlist" &&
          (Date.now() - (notif.timestamp || 0)) < 60 * 60 * 1000 // Within last hour
      );
      
      if (!recentWishlistNotification) {
        addNotification({
          type: "wishlist",
          title: "New items in your wishlist",
          message: "You have new items in your wishlist. Check them out!",
        });
      }
      
      return newWishlist;
    });
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some((item) => item.id === itemId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const WishlistProvider = ({ children }) => {
  return <WishlistProviderInner>{children}</WishlistProviderInner>;
};
