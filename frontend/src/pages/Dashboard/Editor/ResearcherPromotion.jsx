import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditorStyle/ResearcherPromotion.css";

const API_BASE_URL = "http://localhost:8080";

const ResearcherPromotion = () => {
  const [researchers, setResearchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/authorPromotion`);

        if (response.data && response.data.data) {
          setResearchers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearchers();
  }, []);

  const promoteResearcher = async (researcher) => {
    const fullName = researcher.first_name
      ? `${researcher.first_name} ${researcher.last_name}`
      : researcher.name;

    if (
      window.confirm(
        `Are you sure you want to promote ${fullName} to a Reviewer?`,
      )
    ) {
      try {
        await axios.put(`${API_BASE_URL}/authorPromotion/${researcher.id}`);

        alert(`Success! ${fullName} is now a Reviewer.`);

        setResearchers((prev) =>
          prev.filter((item) => item.id !== researcher.id),
        );
      } catch (error) {
        console.error("Promotion failed:", error);
        alert("Failed to promote user. Check console for details.");
      }
    }
  };

  return (
    <div className="promotion-container">
      <h3 className="page-title">Researcher Promotion</h3>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading authors...
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>Author Name</th>
                <th>Email</th>
                <th>Degree</th>
                <th>Institution</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {researchers.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.first_name} {item.last_name}
                    {item.name}
                  </td>
                  <td>{item.email}</td>
                  <td>{item.degree || "N/A"}</td>
                  <td>{item.institution || "N/A"}</td>
                  <td>
                    <span className="badge badge-author">{item.role}</span>
                  </td>
                  <td>
                    <button
                      className="btn-promote"
                      onClick={() => promoteResearcher(item)}
                    >
                      Promote to Reviewer
                    </button>
                  </td>
                </tr>
              ))}

              {researchers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No authors found to promote.
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

export default ResearcherPromotion;
