import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthorStyle/AuthorHome.css";

const AuthorHome = () => {
  const [authorName, setAuthorName] = useState("Researcher");
  const [stats, setStats] = useState({
    submitted: 0,
    underReview: 0,
    published: 0,
  });

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");

    if (storedName) {
      setAuthorName(storedName);
    }

    if (userId) {
      const fetchStats = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/myResearch/${userId}`,
          );
          const researches = response.data.data || [];

          setStats({
            submitted: researches.length,
            underReview: researches.filter(
              (r) => r.status_research === "under_review",
            ).length,
            published: researches.filter(
              (r) => r.status_research === "published",
            ).length,
          });
        } catch (error) {
          console.error("فشل جلب الإحصائيات:", error);
        }
      };

      fetchStats();
    }
  }, []);

  return (
    <div className="author-home">
      <div className="header-section">
        <h1>Welcome, {authorName}, to JUST Journal</h1>
        <p>Please review our publication policies below</p>
      </div>

      <div className="content-card policies-card">
        <h3>Publication Policies</h3>
        <ul className="policy-list">
          <li>The research paper must be complete and well-structured.</li>
          <li>Must be relevant to the journal’s scope.</li>
          <li>Researcher takes full responsibility for content.</li>
          <li>Citation percentage must be respected.</li>
          <li>No simultaneous submissions allowed.</li>
          <li>All info must be documented.</li>
          <li>Research undergoes peer review.</li>
          <li>Copyrights transferred upon acceptance.</li>
        </ul>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="number">{stats.submitted}</span>
          <span className="label">Submitted Papers</span>
        </div>
        <div className="stat-card">
          <span className="number">{stats.underReview}</span>
          <span className="label">Under Review</span>
        </div>
        <div className="stat-card">
          <span className="number">{stats.published}</span>
          <span className="label">Published</span>
        </div>
      </div>
    </div>
  );
};

export default AuthorHome;
