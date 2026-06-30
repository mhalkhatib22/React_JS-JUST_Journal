import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthorStyle/CreateResearch.css";

const CreateResearch = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "",
    field: "",
    description: "",
    file: null,
    agreedToPolicy: false,
  });

  const researchTypes = [
    "Original Research",
    "Review Article",
    "Case Study",
    "Methodology",
    "Short Communication",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.pdf|\.doc|\.docx|\.ppt|\.pptx)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert(
        "⚠️ Invalid file type! Please upload a PDF, Word, or PowerPoint file.",
      );
      event.target.value = "";
      setForm((prevForm) => ({ ...prevForm, file: null }));
      return;
    }

    setForm((prevForm) => ({ ...prevForm, file: file }));
  };

  const submitResearch = async (e) => {
    e.preventDefault();

    if (!form.agreedToPolicy) {
      alert("⚠️ You must agree to the publication policy before submitting.");
      return;
    }

    if (!form.title || !form.type || !form.file) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("field", form.field);
      formData.append("description", form.description);
      formData.append("agreedToPolicy", "true");
      formData.append("file", form.file);

      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Error: You are not logged in.");
        return;
      }
      formData.append("author_id", userId);

      await axios.post("http://localhost:8080/createResearch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Research submitted successfully!");
      navigate("/author/my-research");
    } catch (error) {
      console.error("Submission Error:", error);
      const serverError =
        error.response?.data?.message || error.response?.data?.error;
      alert(serverError || "Failed to submit research");
    }
  };

  return (
    <div className="create-research-container">
      <div className="form-card">
        <h2 className="form-title">Create New Research</h2>

        <form onSubmit={submitResearch} className="research-form">
          <div className="form-group">
            <label>Research Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Research Type:</label>
            <select
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="" disabled>
                Select Type
              </option>
              {researchTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Research Field:</label>
            <input
              type="text"
              name="field"
              value={form.field}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Research Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows="4"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload File (PDF, Word, PPT):</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="form-control file-input"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="policyCheck"
              name="agreedToPolicy"
              checked={form.agreedToPolicy}
              onChange={handleInputChange}
            />
            <label htmlFor="policyCheck">
              I agree to the publication policy
            </label>
          </div>

          <button type="submit" className="btn-submit">
            Submit Research
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResearch;
