import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BackToHome from "../components/BackToHome";
import "./Style/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prefix: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    degree: "",
    birthDate: "",
    country: "",
    institution: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage(
        "Password must be 8+ chars, contain 1 Uppercase letter & 1 Number.",
      );
      return;
    }

    const birth = new Date(formData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 18) {
      setErrorMessage("You must be 18+ to register.");
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;

      const response = await axios.post("http://localhost:8080/createUser", {
        prefix: formData.prefix,
        name: fullName,
        degree: formData.degree,
        email: formData.email,
        birth_date: formData.birthDate,
        country: formData.country,
        institution: formData.institution,
        password: formData.password,
      });

      if (response.status === 201) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Connection error. Please ensure server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackToHome />
      <div className="signup-container">
        <h1>Create New Account</h1>
        <form onSubmit={handleSignup}>
          <div className="form-row">
            <div className="form-group small">
              <label>Prefix</label>
              <select
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                required
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Mohammad"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Alkhatib"
              />
            </div>
          </div>

          <label>Institution (University)</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            placeholder="Jordan University of Science and Technology"
          />

          <div className="form-row">
            <div className="form-group">
              <label>Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Degree
                </option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Jordan"
              />
            </div>
          </div>

          <label>Date of Birth</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@just.edu.jo"
          />

          <div className="form-row">
            <div className="form-group password-wrapper">
              <label>Password</label>
              <div className="input-icon-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </span>
              </div>
            </div>

            <div className="form-group password-wrapper">
              <label>Confirm Password</label>
              <div className="input-icon-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "🔒"}
                </span>
              </div>
            </div>
          </div>

          <small className="hint-text">
            * Password must be at least 8 chars, include 1 uppercase letter & 1
            number.
          </small>

          {errorMessage && <p className="error-msg">{errorMessage}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
