import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebase/config";
import { updateEmail, updatePassword } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import axios from "axios";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../config/cloudinary/cloudinaryConfig";

const Settings = () => {
  const [userData, setUserData] = useState({ name: "", email: "", profileImage: "" });
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleImageUpload = async () => {
    if (!image) return userData.profileImage;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("public_id", `profile_images/${user.uid}`);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return userData.profileImage;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newImageUrl = await handleImageUpload();

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { ...userData, profileImage: newImageUrl });

      if (userData.email !== user.email) {
        await updateEmail(user, userData.email);
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Profile Settings</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4 text-center">
          <img src={userData.profileImage} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mt-2" />
        </div>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          placeholder="Full Name"
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="Email"
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password (optional)"
          className="input input-bordered w-full mb-2"
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
