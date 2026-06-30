import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditorStyle/AllResearch.css";

const API_BASE_URL = "http://localhost:8080";

const AllResearch = () => {
  const [allResearches, setAllResearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllResearches = async () => {
      try {
        setIsLoading(true);
        // const response = await axios.get(`${API_BASE_URL}/getAllResearches`);
        const response = await axios.get(`${API_BASE_URL}/getResearch`);
        // console.log(response);

        if (response.data && response.data.data) {
          // Sort array ascending by ID[cite: 20]
          const sortedData = response.data.data.sort((a, b) => a.id - b.id);
          setAllResearches(sortedData);
        }
      } catch (error) {
        console.error("Fetch unassigned researches error:", error.message);
        console.error(error);
        alert("Failed to fetch data from the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllResearches();
  }, []);

  const viewResearch = (fileData) => {
    if (!fileData) {
      alert("No file attached for this research");
      return;
    }
    const fixedPath = fileData.replace(/\\/g, "/");
    if (!fixedPath.startsWith("uploads/")) {
      fixedPath = `uploads/${fixedPath}`;
    }
    const fileUrl = `${API_BASE_URL}/${fixedPath}`;
    console.log("Opening:", fileUrl);
    window.open(fileUrl, "_blank");
  };

  const getStatusClass = (status) => {
    if (!status) return "status-submitted";

    const s = status.toLowerCase();

    if (s.includes("publish") || s === "approved") return "status-published";
    if (s.includes("review")) return "status-review";
    if (s.includes("reject")) return "status-rejected";

    return "status-submitted";
  };

  return (
    <div className="all-research-page">
      <div className="page-header">
        <h2>All Submitted Researches</h2>
        <p>List of all research papers submitted to the journal.</p>
      </div>

      <div className="table-card">
        {isLoading ? (
          <div className="loading-state">Loading researches...</div>
        ) : (
          <table className="research-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Field</th>
                <th>Date</th>
                <th>Status</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {allResearches.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td className="title-cell">{item.research_title}</td>
                  <td className="type-cell">{item.type_research}</td>
                  <td>{item.research_field}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(item.status_research)}`}
                    >
                      {item.status_research}
                    </span>
                  </td>
                  <td className="center-text">
                    <button
                      className="btn-view"
                      onClick={() => viewResearch(item.address_file)}
                    >
                      📄 View
                    </button>
                  </td>
                </tr>
              ))}

              {allResearches.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No researches found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllResearch;
