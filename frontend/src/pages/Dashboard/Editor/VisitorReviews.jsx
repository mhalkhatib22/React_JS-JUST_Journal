import React, { useState } from "react";
import "./EditorStyle/VisitorReviews.css";

const VisitorReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      visitorName: "John Doe",
      email: "john@gmail.com",
      message: "Great journal! The submission process was very smooth.",
      date: "2025-10-25",
    },
    {
      id: 2,
      visitorName: "Alice Smith",
      email: "alice@yahoo.com",
      message: "I faced some issues uploading my PDF, please fix it.",
      date: "2025-10-26",
    },
    {
      id: 3,
      visitorName: "Mohammed Salem",
      email: "mohammed@outlook.com",
      message: "Excellent selection of research topics in the AI section.",
      date: "2025-10-27",
    },
  ]);

  const deleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((review) => review.id !== id));
      alert("Review deleted successfully.");
    }
  };

  return (
    <div className="visitor-reviews-container">
      <h3 className="page-title">Visitor Reviews</h3>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>#</th>
              <th>Visitor Name</th>
              <th>Email</th>
              <th>Message / Review</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td className="name-cell">{review.visitorName}</td>
                <td>{review.email}</td>
                <td className="message-cell">{review.message}</td>
                <td>{review.date}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  No reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorReviews;
