import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BackToHome from "../components/BackToHome";
import "./Style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;
      const userData = response.data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userName", userData.userName);

        if (userData.role === "author") {
          navigate("/author");
        } else if (userData.role === "editor") {
          navigate("/editor");
        } else if (userData.role === "reviewer") {
          navigate("/reviewer");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || "Invalid login details");
      } else {
        setErrorMessage(
          "Server connection failed (make sure Port 8080 is running)",
        );
      }
    }
  };

  return (
    <>
      <BackToHome />
      <div className="login-container">
        <h1>Login</h1>
        <h1>JUST JOURNAL</h1>
        <p className="subtitle">Sign in to your account</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="athor@just_journal.com"
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
          />

          {errorMessage && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {errorMessage}
            </p>
          )}

          <button type="submit">Login</button>

          <div className="signup">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
          <div className="forgot-password">
            <p>
              <Link to="/forgot-password">Forgot Password ?</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
