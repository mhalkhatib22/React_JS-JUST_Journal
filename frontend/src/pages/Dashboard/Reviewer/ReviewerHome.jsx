import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewerStyle/ReviewerHome.css";

const API_BASE_URL = "http://localhost:8080";

const ReviewerHome = () => {
  const [reviewerName, setReviewerName] = useState("Reviewer");

  useEffect(() => {
    const fetchReviewerName = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/information/${userId}`,
          );
          if (response.data && response.data.data) {
            const user = response.data.data;
            if (user.name) {
              setReviewerName(user.name);
            }
          }
        } catch (error) {
          console.error("Error fetching reviewer name:", error);
        }
      }
    };

    fetchReviewerName();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="welcome-card">
        <h1>Welcome, {reviewerName}</h1>
        <p>Please review the general peer-review policies below</p>
      </div>

      <div className="content-card">
        <h2 className="section-title">
          Please conduct the peer-review process according to scientific
          principles.
        </h2>

        <p className="intro-text">
          The peer-review of a scientific research paper or scholarly work
          should not be conducted arbitrarily; rather, it must be based on
          criteria and guidelines established by expert reviewers. These
          criteria aim to eliminate randomness and inconsistency in the review
          process, prevent reviewer bias toward any researcher, reduce
          contradictions in reviewers' final judgments, and ensure transparency
          and integrity in evaluating scientific or scholarly work. The main
          scientific foundations for evaluating research can be summarized as
          follows:
        </p>

        <ul className="guidelines-list">
          <li>
            <strong>Review based on the completeness of the research:</strong>{" "}
            verifying that the scientific research or scholarly work contains
            all required elements from the first page to the final section.
          </li>
          <li>
            <strong>
              Review based on the presence and quality of research components:
            </strong>{" "}
            evaluating each section individually to ensure it is accurate and
            properly written, including the research title, research problem,
            objectives and significance, chapters, tables, and indexes.
          </li>
          <li>
            <strong>Review based on citation and referencing practices:</strong>{" "}
            assessing the percentage of cited material and determining its
            appropriateness, as well as evaluating whether the referencing
            method follows proper academic standards.
          </li>
          <li>
            <strong>
              Review based on the organization and formatting of the research:
            </strong>{" "}
            ensuring that the research follows a logical sequence and that its
            components are arranged according to standard scientific research
            principles.
          </li>
          <li>
            <strong>
              Review based on writing accuracy and technical correctness:
            </strong>{" "}
            confirming the absence of linguistic and typographical errors, and
            ensuring that the researcher has performed proper linguistic and
            grammatical proofreading.
          </li>
          <li>
            <strong>Review based on research ethics:</strong> verifying that the
            researcher adhered to ethical standards, ensuring the absence of
            plagiarism, and evaluating the objectivity, logic, honesty, and
            accuracy reflected in the scientific work.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewerHome;
