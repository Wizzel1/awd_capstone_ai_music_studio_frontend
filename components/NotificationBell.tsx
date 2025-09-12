"use client";
import { getApiUrl } from "@/lib/env";
import { useUserTasks } from "@/lib/providers/UserTaskProvider";
import { Notification, notificationSchema } from "@/lib/types/notification";
import { Bell, BellDot, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export default function NotificationBell() {
  const { getProjectIdByTaskId } = useUserTasks();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to SSE stream
    const connectToNotifications = () => {
      // EventSource doesn't support custom headers, so we need to pass auth via URL params or cookies
      // If using JWT, you might need to use fetch with ReadableStream instead
      const eventSource = new EventSource(getApiUrl("/notifications/stream"), {
        withCredentials: true, // Include cookies for authentication
      });

      eventSource.onopen = () => {
        console.log("Connected to notifications stream");
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const notification = notificationSchema.parse(data);
          setNotifications((prev) => {
            // Add new notification at the beginning and remove duplicates
            const filtered = prev.filter((n) => n.id !== notification.id);
            return [notification, ...filtered];
          });
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToNotifications();
          }
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    };

    connectToNotifications();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const hasUnreadNotifications = notifications.some(
    (n) => n.status !== "read" && !n.isDeleted
  );
  const visibleNotifications = notifications.filter((n) => !n.isDeleted);
  const unreadNotifications = visibleNotifications.filter(
    (n) => n.status !== "read"
  );
  const readNotifications = visibleNotifications.filter(
    (n) => n.status === "read"
  );

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(getApiUrl(`/notifications/${notificationId}/read`), {
        method: "PATCH",
        credentials: "include",
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? {
                ...n,
                status: "read" as const,
                readAt: new Date().toISOString(),
              }
            : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAsDeleted = async (notificationId: string) => {
    try {
      await fetch(getApiUrl(`/notifications/${notificationId}/delete`), {
        method: "PATCH",
        credentials: "include",
      });

      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as deleted:", error);
    }
  };

  const handleNotificationClick = (notificationId: string, taskId: string) => {
    // Mark as read and navigate to project page
    markAsRead(notificationId);
    if (!taskId) return;
    const projectId = getProjectIdByTaskId(taskId);
    if (projectId) {
      window.location.href = `/projects/${projectId}`;
    } else {
      console.warn("Project ID not found for task:", taskId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-zinc-100 transition-colors"
      >
        {hasUnreadNotifications ? (
          <BellDot className="h-4 w-4 text-zinc-600" />
        ) : (
          <Bell className="h-4 w-4 text-zinc-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Unread notifications first */}
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer bg-blue-50"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.taskId
                      )
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Task: {notification.taskId}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsDeleted(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete notification"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Read notifications */}
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer opacity-60"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.taskId
                      )
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Task: {notification.taskId}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsDeleted(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete notification"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
