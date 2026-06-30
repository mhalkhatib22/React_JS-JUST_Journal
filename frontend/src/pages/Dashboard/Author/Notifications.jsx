import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthorStyle/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/myNotifications/${userId}`,
        );
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notifications-container">
      <h2>My Notifications</h2>

      {isLoading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <div className="notifications-list">
          {notifications.length === 0 && (
            <div className="empty-state">
              <p>You have no notifications yet.</p>
            </div>
          )}

          {notifications.map((note) => (
            <div
              key={note.id}
              className={`notification-card ${note.is_read === 0 ? "unread" : ""}`}
            >
              <div className="note-icon">🔔</div>
              <div className="note-content">
                <h4>{note.title}</h4>
                <p>{note.message}</p>
                <span className="note-time">{formatDate(note.created_at)}</span>
              </div>
              {note.is_read === 0 && <div className="new-badge">New</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
