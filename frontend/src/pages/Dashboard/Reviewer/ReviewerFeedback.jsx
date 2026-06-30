import React, { useState } from "react";
import axios from "axios";
import "./ReviewerStyle/ReviewerFeedback.css";

const API_BASE_URL = "http://localhost:8080";

const ReviewerFeedback = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendFeedback = async () => {
    const userId = localStorage.getItem("userId");
    if (!message) return alert("Please write a message first.");

    setIsLoading(true);
    try {
      const defaultSubject = "General Feedback";

      await axios.post(`${API_BASE_URL}/createFeedback`, {
        user_id: userId,
        subject: defaultSubject,
        message: message,
      });

      alert("Feedback sent successfully! 📨");
      setMessage("");
    } catch (e) {
      console.error(e);
      alert("Error sending feedback");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="page-title">Reviewer Feedback</h2>
      <p className="subtitle">
        Have an issue or suggestion? Send it directly to the editor.
      </p>

      <div className="form-group">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="textarea-field"
        ></textarea>
      </div>

      <div className="actions">
        <button onClick={sendFeedback} disabled={isLoading} className="btn">
          {isLoading ? "Sending..." : "Send Feedback 🚀"}
        </button>
      </div>
    </div>
  );
};

export default ReviewerFeedback;
