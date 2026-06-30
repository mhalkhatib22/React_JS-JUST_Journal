import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
// import Navbar from "../components/Navbar";
import Navbar from "../components/Navbar";
import "./Style/Home.css";

const API_BASE_URL = "http://localhost:8080";

const Home = () => {
  const [approvedResearches, setApprovedResearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE_URL}/postedResearches`);
        setApprovedResearches(res.data.data);
      } catch (error) {
        console.error("Error fetching researches", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearches();
  }, []);

  const filteredResearches = useMemo(() => {
    if (!approvedResearches) return [];

    const query = searchQuery.toLowerCase();

    return approvedResearches.filter(
      (r) =>
        (r.title && r.title.toLowerCase().includes(query)) ||
        (r.category && r.category.toLowerCase().includes(query)) ||
        (r.author && r.author.toLowerCase().includes(query)) ||
        (r.abstract && r.abstract.toLowerCase().includes(query)),
    );
  }, [approvedResearches, searchQuery]);

  const openFile = (filePath) => {
    if (filePath) {
      const cleanPath = filePath.replace(/\\/g, "/");
      window.open(`${API_BASE_URL}/${cleanPath}`, "_blank");
    } else {
      alert("No file attached.");
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div className="home-container">
      <Navbar />

      <header className="hero-section">
        <h1>Welcome to JUST Journal</h1>
        <p>
          A leading scientific platform dedicated to publishing high-quality
          academic research.
        </p>

        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, field, or abstract..."
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      <section className="research-section">
        <div className="section-header">
          <h2>Recently Published Research</h2>
          <p>Explore the latest scientific findings</p>
        </div>

        {isLoading ? (
          <div className="loading">Loading researches...</div>
        ) : (
          <div className="cards-grid">
            {filteredResearches.map((item) => (
              <div key={item.id} className="article-card">
                <span className="badge">{item.category || "General"}</span>
                <h3>{item.title}</h3>
                <p className="description">
                  {item.abstract || "No abstract available."}
                </p>

                <div className="author-info">
                  <div className="avatar">{getInitial(item.author)}</div>
                  <div className="details">
                    <span className="author-name">{item.author}</span>
                    <span className="author-uni">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "Now"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openFile(item.filePath)}
                  className="btn-read-card"
                >
                  Read Research 📄
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredResearches.length === 0 && (
          <div className="no-results">
            <p>No researches found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;