import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditorStyle/SendResearchForReview.css";

const API_BASE_URL = "http://localhost:8080";

const SendResearchForReview = () => {
  const [researches, setResearches] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resPapers = await axios.get(`${API_BASE_URL}/getResearch`);
        if (resPapers.data && resPapers.data.data) {
          setResearches(resPapers.data.data);
        }

        const resReviewers = await axios.get(`${API_BASE_URL}/getReviewers`);
        if (resReviewers.data && resReviewers.data.data) {
          setReviewers(resReviewers.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectResearch = (paper) => {
    setSelectedResearch(paper);
    setSelectedReviewers([]);
  };

  const toggleReviewer = (id) => {
    if (selectedReviewers.includes(id)) {
      setSelectedReviewers((prev) => prev.filter((r) => r !== id));
    } else {
      setSelectedReviewers((prev) => [...prev, id]);
    }
  };

  const viewResearch = (fileData) => {
    if (!fileData) return alert("No file attached");
    const fixedPath = fileData.replace(/\\/g, "/");
    window.open(`${API_BASE_URL}/${fixedPath}`, "_blank");
  };

  const handleSubmit = async () => {
    if (!selectedResearch) return alert("Please select a research paper");
    if (selectedReviewers.length === 0)
      return alert("Please select at least one reviewer");

    try {
      await axios.post(`${API_BASE_URL}/assignReviewer`, {
        researchId: selectedResearch.id,
        reviewerIds: selectedReviewers,
        authorId: selectedResearch.user_id,
      });

      alert("Research assigned to reviewers successfully! ✅");

      setResearches((prev) =>
        prev.filter((item) => item.id !== selectedResearch.id),
      );
      setSelectedResearch(null);
      setSelectedReviewers([]);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during submission");
    }
  };

  return (
    <div className="send-review-container">
      <h3 className="section-title">Send Research for Review</h3>

      {isLoading ? (
        <div className="loading-state">Loading data...</div>
      ) : (
        <div>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="select-col">Select</th>
                  <th>Research Title</th>
                  <th>Type</th>
                  <th>Field</th>
                  <th>Abstract</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                {researches.map((item) => (
                  <tr key={item.id}>
                    <td className="center-text">
                      <input
                        type="radio"
                        name="researchGroup"
                        checked={selectedResearch?.id === item.id}
                        onChange={() => selectResearch(item)}
                      />
                    </td>
                    <td>{item.research_title}</td>
                    <td>{item.type_research}</td>
                    <td>{item.research_field}</td>
                    <td className="desc-cell">{item.abstract}</td>
                    <td className="center-text">
                      <button
                        className="btn-view"
                        onClick={() => viewResearch(item.address_file)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="section-title mt-large">
            Select Reviewers (Multiple)
          </h3>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="select-col">Select</th>
                  <th>Name</th>
                  <th>Qualification</th>
                  <th>Institution</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {reviewers.map((reviewer) => (
                  <tr
                    key={reviewer.id}
                    className={
                      selectedReviewers.includes(reviewer.id)
                        ? "selected-row"
                        : ""
                    }
                  >
                    <td className="center-text">
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => toggleReviewer(reviewer.id)}
                      />
                    </td>
                    <td>{reviewer.name}</td>
                    <td>{reviewer.qualification || reviewer.degree}</td>
                    <td>{reviewer.institution}</td>
                    <td>{reviewer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions">
            {selectedReviewers.length > 0 && (
              <span className="selection-info">
                Selected: <strong>{selectedReviewers.length}</strong> reviewers
              </span>
            )}
            <button className="btn-submit" onClick={handleSubmit}>
              Submit Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendResearchForReview;
