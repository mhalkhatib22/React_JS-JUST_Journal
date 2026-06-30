import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Style/Policies.css";

const Policies = () => {
  const [selectedPolicy, setSelectedPolicy] = useState("general");

  const selectPolicy = (type) => {
    setSelectedPolicy(type);
  };

  return (
    <>
      <Navbar/>

      <section className="policies-page">
        <div className="section-header">
          <h3>Journal Publication Policies</h3>
          <p>Please review the publication and peer-review policies below.</p>
        </div>

        <div className="policy-buttons">
          <button
            className={`policy-btn ${selectedPolicy === "general" ? "active" : ""}`}
            onClick={() => selectPolicy("general")}
          >
            General Publishing Policies
          </button>

          <button
            className={`policy-btn ${selectedPolicy === "peer" ? "active" : ""}`}
            onClick={() => selectPolicy("peer")}
          >
            Peer Review Policies
          </button>
        </div>

        {selectedPolicy === "general" && (
          <div className="policy-card">
            <h4 className="policy-title">General Publishing Policies</h4>
            <ul className="policy-list">
              <li>
                The submitted research must be complete and well-structured.
              </li>
              <li>
                Authors are fully responsible for all information and data
                included in the manuscript.
              </li>
              <li>
                Researchers must adhere to the allowed citation percentage and
                ensure the originality of the ideas.
              </li>
              <li>
                The manuscript must not be published previously or submitted to
                any other journal.
              </li>
              <li>
                All information must be properly referenced according to
                scientific standards.
              </li>
              <li>
                Research must be submitted in two languages: the original
                language and English (or Arabic if originally in English).
              </li>
              <li>
                Submitted manuscripts undergo professional review, editing, and
                evaluation.
              </li>
              <li>
                Upon acceptance, all publishing and copyright rights are
                transferred to the journal.
              </li>
            </ul>
          </div>
        )}

        {selectedPolicy === "peer" && (
          <div className="policy-card">
            <h4 className="policy-title">Peer Review Policies</h4>
            <ul className="policy-list">
              <li>
                Reviewers verify that the manuscript is complete in all
                sections.
              </li>
              <li>
                Each element is evaluated separately (title, problem,
                objectives, chapters, tables...).
              </li>
              <li>
                Citation percentage and documentation accuracy are checked.
              </li>
              <li>Reviewers ensure proper formatting and logical structure.</li>
              <li>
                The manuscript must be free from linguistic and grammatical
                errors.
              </li>
              <li>
                Ethical standards must be followed: academic honesty,
                objectivity, validity, and integrity.
              </li>
              <li>
                Review ensures detection of plagiarism and scientific misconduct
                if present.
              </li>
            </ul>
          </div>
        )}
      </section>
    </>
  );
};

export default Policies;
