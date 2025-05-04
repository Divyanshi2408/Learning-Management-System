import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateUser } from "../redux/userSlice";
import {Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: { local: "", city: "", state: "", country: "", pincode: "" },
    profession: "",
    organization: { name: "", address: "" },
    qualification: "",
    degree: "",
    qualificationStatus: "",
    interests: "",
    professionalTitle: "",
    totalExperience: "",
    socialLinks: { linkedIn: "", github: "", youtube: "", twitter: "" },
    careerDescription: "",
    accessLevel: "",
  });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        gender: currentUser.gender || "",
        dateOfBirth: currentUser.dateOfBirth ? currentUser.dateOfBirth.split("T")[0] : "",
        address: currentUser.address || { local: "", city: "", state: "", country: "", pincode: "" },
        profession: currentUser.profession || "",
        organization: currentUser.organization || { name: "", address: "" },
        qualification: currentUser.qualification || "",
        degree: currentUser.degree || "",
        qualificationStatus: currentUser.qualificationStatus || "",
        interests: currentUser.interests || "",
        professionalTitle: currentUser.professionalTitle || "",
        totalExperience: currentUser.totalExperience || "",
        socialLinks: currentUser.socialLinks || { linkedIn: "", github: "", youtube: "", twitter: "" },
        careerDescription: currentUser.careerDescription || "",
        accessLevel: currentUser.accessLevel || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id: currentUser._id, updates: formData })).unwrap();
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      alert("Failed to update profile!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <Link to="/profile">
      <FaArrowLeft/> 
      </Link>
      <h2 className="text-2xl font-bold mb-5">Update Details</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Common Address Fields */}
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {currentUser?.role === "learner" && (
          <>
            <div>
              <label className="block text-sm font-medium">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </>
        )}

        {currentUser?.role === "trainer" && (
          <>
            <div>
              <label className="block text-sm font-medium">Professional Title</label>
              <input
                type="text"
                name="professionalTitle"
                value={formData.professionalTitle}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Total Experience (Years)</label>
              <input
                type="number"
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </>
        )}

        {currentUser?.role === "admin" && (
          <div>
            <label className="block text-sm font-medium">Access Level</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Access Level</option>
              <option value="Full Admin">Full Admin</option>
              <option value="Content Manager">Content Manager</option>
              <option value="Finance Manager">Finance Manager</option>
            </select>
          </div>
        )}

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium">LinkedIn</label>
          <input
            type="text"
            name="socialLinks.linkedIn"
            value={formData.socialLinks.linkedIn}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Github</label>
          <input
            type="text"
            name="socialLinks.github"
            value={formData.socialLinks.github}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
