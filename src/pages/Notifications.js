import React, { useState, useEffect } from "react";
import notificationService from "../services/notificationService";
import "../css/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getAllNotifications(1, 50);
        setNotifications(response.notifications.items);
        console.log(response.notifications.items);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      console.log(id);
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="list-group">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                notification.isRead ? "list-group-item-read" : "list-group-item-unread"
              }`}
            >
          <div
            dangerouslySetInnerHTML={{
              __html: notification.message,
            }}
          ></div>
              {!notification.isRead && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
