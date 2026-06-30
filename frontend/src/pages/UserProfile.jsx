import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Style/UserProfile.css";

const API_BASE_URL = "http://localhost:8080";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    photoUrl: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [homeLink, setHomeLink] = useState("/");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (!userId) {
      navigate("/login");
      return;
    }

    if (role === "author") setHomeLink("/author");
    else if (role === "editor") setHomeLink("/editor");
    else if (role === "reviewer") setHomeLink("/reviewer");

    const fetchUserInfo = async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/information/${id}`);
        if (response.data && response.data.data) {
          const data = response.data.data;
          const photoPath = data.profile_photo_path
            ? `${API_BASE_URL}/${data.profile_photo_path.replace(/\\/g, "/")}`
            : null;

          setUser({
            name: data.name,
            email: data.email,
            role: data.role,
            photoUrl: photoPath,
          });

          if (photoPath) setPreviewImage(photoPath);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserInfo(userId);
  }, [navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return alert("Please select a photo first.");
    const userId = localStorage.getItem("userId");

    try {
      const formData = new FormData();
      formData.append("profile_photo", selectedFile);

      await axios.put(
        `${API_BASE_URL}/updateProfilePhoto/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      alert("Profile photo updated successfully! 📸");
      window.location.reload();
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to update photo");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("New passwords do not match!");
    }

    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`${API_BASE_URL}/changePassword`, {
        userId: userId,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Password changed successfully! 🔒");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="profile-container">
      <div className="info-summary">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> <span className="role-badge">{user.role}</span>
        </p>
      </div>

      <div className="profile-grid">
        <div className="card photo-card">
          <h3>Profile Photo</h3>
          <div className="photo-preview-area">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
            )}
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="file-input"
            />
          </div>
          <button onClick={uploadPhoto} className="btn-save">
            Update Photo
          </button>
        </div>

        <div className="card password-card">
          <h3>Change Password</h3>
          <form onSubmit={changePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn-save btn-danger">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
