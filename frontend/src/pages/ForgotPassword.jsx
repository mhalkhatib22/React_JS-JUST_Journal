import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Style/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/forgot-password", { email });
      alert("Password reset link sent to your email");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="forgot-pass-container">
      <h1>Forgot Password</h1>
      <form onSubmit={resetPassword}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
        <div className="login-link">
          <p>
            Remembered your password? <Link to="/login">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
