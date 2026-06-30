import React, { useState } from "react";
import axios from "axios";
import "./AuthorStyle/CreateFeedback.css";

const CreateFeedback = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please enter a message before sending.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Error: User not found. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8080/createFeedback", {
        user_id: userId,
        message: message,
      });

      alert("Feedback sent successfully! Thank you.");
      setMessage("");
    } catch (error) {
      console.error("Feedback Error:", error);
      alert("Failed to send feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="header">
          <h2>Send Feedback</h2>
          <p>
            We value your opinion. Please let us know if you have any
            suggestions or issues.
          </p>
        </div>

        <form onSubmit={submitFeedback}>
          <div className="form-group">
            <label htmlFor="feedbackMsg">Your Message:</label>
            <textarea
              id="feedbackMsg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="6"
              placeholder="Write your feedback here..."
              className="form-control"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedback;
