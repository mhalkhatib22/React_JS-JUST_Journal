import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; // Ensure you merge your CSS into this single file
// import "./navs.css"

const API_BASE_URL = "http://localhost:8080";

const Navbar = () => {
  const navigate = useNavigate();

  // -- Auth States --
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  // -- User Profile States --
  const [userInitial, setUserInitial] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  // -- Notification States --
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // 1. Check Authentication on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
      // Set a fallback initial based on role (e.g., "A", "E", or "R")
      setUserInitial(role.charAt(0).toUpperCase());
    }
  }, []);

  // 2. Fetch User Data & Notifications (Only if logged in)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!isLoggedIn || !userId) return;

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/information/${userId}`,
        );
        if (response.data && response.data.data) {
          const user = response.data.data;
          setUserInitial(
            user.name
              ? user.name.charAt(0).toUpperCase()
              : userRole.charAt(0).toUpperCase(),
          );
          if (user.profile_photo_path) {
            const fixedPath = user.profile_photo_path.replace(/\\/g, "/");
            setUserPhoto(`${API_BASE_URL}/${fixedPath}`);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/myNotifications/${userId}`,
        );
        if (response.data && response.data.data) {
          setNotifications(response.data.data);
          setUnreadCount(
            response.data.data.filter((n) => n.is_read === 0).length,
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, userRole]);

  // 3. Handle Dropdown Closing on Outside Clicks
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".nav-right")) {
        setShowNotifDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    window.addEventListener("click", closeDropdowns);
    return () => window.removeEventListener("click", closeDropdowns);
  }, []);

  // -- Action Handlers --
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifDropdown(!showNotifDropdown);
    setShowProfileDropdown(false);
  };

  const markOneAsRead = (notification) => {
    if (notification.is_read === 1) return;
    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, is_read: 1 } : n,
    );
    setNotifications(updatedNotifications);
    if (unreadCount > 0) setUnreadCount((prev) => prev - 1);
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifDropdown(false);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole("");
    navigate("/login");
  };

  // -- Dynamic Render Function for Nav Links --
  const renderNavLinks = () => {
    if (!isLoggedIn) {
      return (
        <>
          <NavLink to="/" end className="nav-item">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-item">
            About
          </NavLink>
          <NavLink to="/policies" className="nav-item">
            Policies
          </NavLink>
        </>
      );
    }

    switch (userRole) {
      case "author":
        return (
          <>
            <NavLink to="/author" end className="nav-item">
              Home
            </NavLink>
            <NavLink to="/author/create" className="nav-item">
              Create Research
            </NavLink>
            <NavLink to="/author/my-research" className="nav-item">
              My Research
            </NavLink>
            <NavLink to="/author/feedback" className="nav-item">
              Feedback
            </NavLink>
          </>
        );
      case "editor":
        return (
          <>
            <NavLink to="/editor" end className="nav-item">
              Home
            </NavLink>
            <NavLink to="/editor/all-research" className="nav-item">
              All Research
            </NavLink>
            <NavLink to="/editor/send-for-review" className="nav-item">
              Send to Review
            </NavLink>
            <NavLink to="/editor/final-decision" className="nav-item">
              Final Decision
            </NavLink>
            <NavLink to="/editor/view-feedback" className="nav-item">
              View Feedback
            </NavLink>
          </>
        );
      case "reviewer":
        return (
          <>
            <NavLink to="/reviewer" end className="nav-item">
              Home
            </NavLink>
            <NavLink to="/reviewer/review-papers" className="nav-item">
              Review Papers
            </NavLink>
            <NavLink to="/reviewer/feedback" className="nav-item">
              Feedback
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className={`navbar `}>
      {/* Left side: Logo & Links */}
      <div className="nav-links">
        <Link
          to="/"
          className="logo-section"
          style={{ textDecoration: "none" }}
        >
          <h2>JUST Journal</h2>
          {/* {!isLoggedIn && (
            <span className="subtitle">Scientific Research Publishing</span>
          )} */}
        </Link>

        <div className={!isLoggedIn ? "center-links" : ""}>
          {renderNavLinks()}
        </div>
      </div>

      {/* Right Side: Auth Buttons OR Profile/Notifications */}
      <div className={!isLoggedIn ? "right-actions" : "nav-right"}>
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-login">
              Login
            </Link>
            <Link to="/signup" className="btn btn-signup">
              Sign Up
            </Link>
          </div>
        ) : (
          <>
            {/* Notifications */}
            <div className="notification-icon" onClick={toggleNotifications}>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#fb923c"
                stroke="none"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {showNotifDropdown && (
                <div className="dropdown-menu notifications-dropdown">
                  <div className="dropdown-header">Notifications</div>
                  {notifications.length === 0 ? (
                    <div className="no-notif">No new notifications</div>
                  ) : (
                    <ul className="notif-list">
                      {notifications.map((notif) => (
                        <li
                          key={notif.id}
                          className={`notif-item ${notif.is_read === 0 ? "unread" : ""}`}
                          onMouseEnter={() => markOneAsRead(notif)}
                        >
                          <div className="notif-content">
                            <p className="notif-title">{notif.title}</p>
                            <p className="notif-body">{notif.message}</p>
                            <span className="notif-date">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {notif.is_read === 0 && (
                            <span className="blue-dot"></span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="profile-wrapper" onClick={toggleProfile}>
              <div className="user-avatar">
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="avatar-img" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              {showProfileDropdown && (
                <div className="dropdown-menu profile-dropdown">
                  <Link to={`/${userRole}/profile`} className="dropdown-item">
                    ⚙️ Profile & Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={logout}
                    className="dropdown-item logout-item"
                    style={{
                      border: "none",
                      background: "none",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;