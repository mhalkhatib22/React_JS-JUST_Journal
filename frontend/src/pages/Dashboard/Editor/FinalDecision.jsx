import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditorStyle/FinalDecision.css";

const API_BASE_URL = "http://localhost:8080";

const FinalDecision = () => {
  const [pendingDecisions, setPendingDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalNoteContent, setModalNoteContent] = useState("");

  useEffect(() => {
    const fetchReviewedResearches = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/getReviewedResearches`,
        );
        if (response.data && response.data.data) {
          setPendingDecisions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewedResearches();
  }, []);

  const viewResearchFile = (fileData) => {
    if (!fileData) {
      alert("No file attached for this research.");
      return;
    }
    const fixedPath = fileData.replace(/\\/g, "/");
    const fileUrl = `${API_BASE_URL}/${fixedPath}`;
    window.open(fileUrl, "_blank");
  };

  const openNoteModal = (note) => {
    setModalNoteContent(
      note || "No additional notes provided by the reviewer.",
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalNoteContent("");
  };

  const handleFinalDecision = async (id, decision) => {
    const actionText = decision === "post" ? "Publish" : "Reject";
    if (
      !window.confirm(`Are you sure you want to ${actionText} this research?`)
    )
      return;

    try {
      await axios.put(`${API_BASE_URL}/updateStatusResearch/${id}`, {
        status: decision,
      });

      setPendingDecisions((prev) => prev.filter((item) => item.id !== id));
      alert(
        `Research has been ${decision === "post" ? "Published" : "Rejected"} successfully.`,
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="final-decision-container">
      <h3 className="page-title">Final Decision</h3>

      {isLoading ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>Reviewer Name</th>
                <th>Research Title</th>
                <th>File</th>
                <th>Reviewer Decision</th>
                <th>Reviewer Notes</th>
                <th>Final Decision</th>
              </tr>
            </thead>
            <tbody>
              {pendingDecisions.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.reviewer_name}</td>
                  <td title={item.abstract}>{item.research_title}</td>

                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-icon"
                      onClick={() => viewResearchFile(item.address_file)}
                      title="View File"
                    >
                      📄 View
                    </button>
                  </td>

                  <td>
                    <span
                      className={`badge ${item.decision && item.decision.toLowerCase().includes("accept") ? "badge-accept" : "badge-reject"}`}
                    >
                      {item.decision}
                    </span>
                  </td>

                  <td className="notes-cell">
                    {item.suggest ? (
                      <div>
                        <span className="note-preview">
                          {item.suggest.substring(0, 15)}...
                        </span>
                        <button
                          className="btn-view-note"
                          onClick={() => openNoteModal(item.suggest)}
                        >
                          👁️ Read
                        </button>
                      </div>
                    ) : (
                      <span className="no-notes">-</span>
                    )}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-publish"
                        onClick={() => handleFinalDecision(item.id, "post")}
                      >
                        Publish
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleFinalDecision(item.id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pendingDecisions.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No reviewed researches pending decision.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Reviewer Notes</h4>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>{modalNoteContent}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalDecision;
