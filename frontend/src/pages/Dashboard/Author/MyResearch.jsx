import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthorStyle/MyResearch.css";

const MyResearch = () => {
  const [myResearches, setMyResearches] = useState([]);

  useEffect(() => {
    const fetchResearches = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/myResearch/${userId}`,
        );

        const mappedData = response.data.data.map((item) => ({
          id: item.id,
          title: item.research_title,
          type: item.type_research,
          field: item.research_field,
          status: item.status_research,
          description: item.abstract,
        }));
        setMyResearches(mappedData);
      } catch (error) {
        console.error("Error fetching researches:", error);
      }
    };

    fetchResearches();
  }, []);

  const getStatusClass = (status) => {
    if (status === "published" || status === "Published")
      return "status-published";
    if (status === "under_review" || status === "Under Review")
      return "status-review";
    return "status-submitted";
  };

  return (
    <div className="my-research-container">
      <div className="page-header">
        <h2>My Research</h2>
      </div>

      <div className="table-card">
        <table className="research-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Field</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myResearches.map((item) => (
              <tr key={item.id}>
                <td className="title-cell">{item.title}</td>
                <td>{item.type}</td>
                <td>{item.field}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

            {myResearches.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  No research papers submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyResearch;
