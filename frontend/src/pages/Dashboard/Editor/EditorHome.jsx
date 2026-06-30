import React, { useState, useEffect } from "react";
import "./EditorStyle/EditorHome.css";

const EditorHome = () => {
  const [editorName, setEditorName] = useState("Loading...");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setEditorName(storedName || "Editor");
  }, []);

  return (
    <div className="editor-home">
      <div className="welcome-card">
        <h2>Welcome, {editorName}, to JUST Journal</h2>

        <p className="intro-text">
          You have the following main responsibilities:
        </p>

        <ul className="responsibilities-list">
          <li>Receive research submissions from publishers.</li>
          <li>Send research papers for peer review.</li>
          <li>Receive reviewers' decisions and comments on the research.</li>
          <li>Give final decisions on research submissions.</li>
          <li>Promote researchers to reviewers within the journal.</li>
        </ul>
      </div>
    </div>
  );
};

export default EditorHome;
