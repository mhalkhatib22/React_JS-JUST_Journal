import React, { useState } from "react";
import axios from "axios";
import "./Style/Profile.css";

const Profile = () => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.put("http://localhost:8080/changePassword", {
        userId: userId,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      alert("Password changed successfully!");
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) {
      alert("Please select a photo first.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const formData = new FormData();
      formData.append("profile_photo", selectedFile);

      await axios.put(
        `http://localhost:8080/updateProfilePhoto/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.error || "Failed to update profile photo");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile Settings</h2>

      <div className="profile-grid">
        <div className="card photo-card">
          <h3>Change Profile Photo</h3>

          <div className="photo-preview-area">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">No Image Selected</div>
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
              <label>Old Password</label>
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
              <label>Confirm New Password</label>
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

            <button type="submit" className="btn-save">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;