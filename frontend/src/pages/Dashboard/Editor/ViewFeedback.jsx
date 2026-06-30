import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditorStyle/ViewFeedback.css";

const API_BASE_URL = "http://localhost:8080";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/feedback`);

        if (response.data && response.data.data) {
          setFeedbacks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const replyToUser = (email) => {
    const mailSubject = "Re: Your Feedback to Just Journal";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="feedback-container">
      <div className="page-header">
        <h3 className="page-title">User Feedback</h3>
        <p>View inquiries and feedback sent by users.</p>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading messages...</div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>Sender Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="name-cell">{item.name}</td>
                  <td>{item.email}</td>
                  <td className="message-cell" title={item.message}>
                    {item.message}
                  </td>
                  <td
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(item.created_at)}
                  </td>
                  <td className="center-text">
                    <button
                      className="btn-reply"
                      onClick={() => replyToUser(item.email)}
                    >
                      📧 Reply
                    </button>
                  </td>
                </tr>
              ))}

              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No feedback messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
