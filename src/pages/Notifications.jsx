import { Navbar, Footer } from "../components";
import { useNotifications } from "../context/NotificationContext";
import { IconBell, IconX } from "@tabler/icons-react";

/**
 * Notifications page.
 *
 * Fix: `formatRelativeTime(notification.timestamp || Date.now())` was calling
 * `Date.now()` during render — flagged by react-hooks/purity as an impure
 * function call.  The notification objects already have a `timestamp` field
 * (set in NotificationContext at creation time).  We default to 0 if somehow
 * absent, which `formatRelativeTime` handles gracefully.
 */
function Notifications() {
  const {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAllNotifications,
    unreadCount,
    formatRelativeTime,
  } = useNotifications();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-20 bg-white flex-grow">
        <main className="font-[Lexend] bg-white py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0C0D19]">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-[#177529] text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[#177529] font-medium hover:text-[#97C040] transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg border-2 p-4 transition-all ${
                      notification.read
                        ? "border-gray-200"
                        : "border-[#97C040] bg-[#f0f9f4]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#0C0D19]">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#97C040] rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[#6B7280] text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {/* Use stored timestamp — no Date.now() during render */}
                          {formatRelativeTime(notification.timestamp || 0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-[#177529] text-xs font-medium hover:text-[#97C040] transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete notification"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <IconBell size={64} color="#E5E7EB" className="mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg mb-2">No notifications</p>
                <p className="text-[#6B7280] text-sm">
                  You&#39;re all caught up! New notifications will appear here.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Notifications;
