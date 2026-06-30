import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewerStyle/ReviewPapers.css";

const API_BASE_URL = "http://localhost:8080";

const ReviewPapers = () => {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      const reviewerId = localStorage.getItem("userId");
      if (!reviewerId) return alert("Please login first");

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/researchInIreview/${reviewerId}`,
        );

        if (response.data && response.data.data) {
          // Initialize evaluation text for each paper[cite: 19]
          const papersData = response.data.data.map((paper) => ({
            ...paper,
            evaluation: "",
          }));
          setPapers(papersData);
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const viewFile = (filePath) => {
    if (!filePath) return alert("No file attached");
    const fixedPath = filePath.replace(/\\/g, "/");
    window.open(`${API_BASE_URL}/${fixedPath}`, "_blank");
  };

  const submitDecision = async (paper, decisionType) => {
    if (!window.confirm(`Are you sure you want to ${decisionType} this paper?`))
      return;

    const reviewerId = localStorage.getItem("userId");

    try {
      const payload = {
        suggest: paper.evaluation,
        decision: decisionType,
        research_id: paper.research_id,
        reviewer_id: reviewerId,
      };

      await axios.post(`${API_BASE_URL}/addRating`, payload);

      alert(`Research ${decisionType} successfully!`);

      // Remove the paper from the list after successful evaluation[cite: 19]
      setPapers((prevPapers) =>
        prevPapers.filter((p) => p.research_id !== paper.research_id),
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Check console.");
    }
  };

  const handleEvaluationChange = (researchId, value) => {
    setPapers((prevPapers) =>
      prevPapers.map((paper) =>
        paper.research_id === researchId
          ? { ...paper, evaluation: value }
          : paper,
      ),
    );
  };

  return (
    <div className="content-wrapper">
      <h2 className="page-title">Research Papers for Review</h2>

      {isLoading ? (
        <div className="loading-state">Loading assigned papers...</div>
      ) : (
        <div className="table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th style={{ width: "350px" }}>Evaluation & Decision</th>
                <th>Title</th>
                <th>Type</th>
                <th>Abstract</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.research_id}>
                  <td className="evaluation-col">
                    <textarea
                      value={paper.evaluation}
                      onChange={(e) =>
                        handleEvaluationChange(
                          paper.research_id,
                          e.target.value,
                        )
                      }
                      placeholder="Optional: Add your observations/suggestions..."
                      className="obs-input"
                    ></textarea>
                    <div className="action-buttons">
                      <button
                        onClick={() => submitDecision(paper, "Accepted")}
                        className="btn-accept"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => submitDecision(paper, "Rejected")}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </div>
                  </td>

                  <td className="info-cell">{paper.research_title}</td>
                  <td>{paper.type_research}</td>
                  <td className="abstract-cell" title={paper.abstract}>
                    {paper.abstract}
                  </td>

                  <td className="presentation-cell">
                    <button
                      onClick={() => viewFile(paper.address_file)}
                      className="file-link"
                    >
                      📄 View File
                    </button>
                  </td>
                </tr>
              ))}

              {!isLoading && papers.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No papers assigned for review yet.
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

export default ReviewPapers;
