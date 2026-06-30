import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BackToHome.css";

const BackToHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    // Assuming your home route is '/'
    if (location.pathname !== "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [location.pathname]);

  const goHome = () => {
    navigate("/");
  };

  if (!isHome) return null;

  return (
    <div className="back-to-home" onClick={goHome}>
      ← Back to Home
    </div>
  );
};

export default BackToHome;
