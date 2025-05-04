import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateUser } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { fetchResults } from "../redux/examSlice";
import { getEnrolledCourses } from "../redux/courseSlice";
import EnrolledCourses from "../components/EnrolledCourses";
import ExamResults from "../components/ExamResults";
import { motion } from "framer-motion";
import ChangePasswordModal from "./ChangePassword";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const { enrolledCourses } = useSelector((state) => state.courses);
  const { results, loading: resultsLoading } = useSelector((state) => state.exam);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(getEnrolledCourses());
    dispatch(fetchResults());
  }, [dispatch]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    if (selectedFile && currentUser) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);
      try {
        await dispatch(updateUser({ id: currentUser._id, updates: formData }));
        setPreview(null);
        setSelectedFile(null);
        setModalOpen(false);
      } catch (error) {
        console.error("Profile update failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!currentUser) return <p className="text-center">No user profile found.</p>;

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg border border-gray-200 my-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Profile Header */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-6 border-b pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Profile Picture */}
        <div className="relative">
          <button onClick={() => setModalOpen(true)} className="focus:outline-none">
            <img
              src={preview || currentUser.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-400 shadow-xl object-cover"
            />
          </button>
          <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow">
            {currentUser.role.toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800">{currentUser.fullName}</h2>
          <p className="text-gray-600 text-lg">@{currentUser.username}</p>
        </div>

        <Link to="/updateUser" className="ml-auto">
          <button className="px-4 py-2 bg-blue-600 max-sm:mr-25 text-white rounded-md hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </Link>
        <ChangePasswordModal />
      </motion.div>

      {/* Modal */}
      {modalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] md:w-[400px]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Update Profile Picture</h3>
            <img
              src={preview || currentUser.profilePicture || "/default-avatar.png"}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <label htmlFor="profile-upload" className="block bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer text-center">
              Choose New Picture
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex justify-between mt-4">
              {selectedFile && (
                <button
                  onClick={handleProfileUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setModalOpen(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Profile Info Section */}
      <motion.div className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {currentUser.privacySettings?.showEmail && (
          <p><strong>Email:</strong> {currentUser.email}</p>
        )}
        {currentUser.privacySettings?.showPhone && currentUser.phoneNumber && (
          <p><strong>Phone:</strong> {currentUser.phoneNumber}</p>
        )}
        {currentUser.dateOfBirth && (
          <p><strong>Date of Birth:</strong> {new Date(currentUser.dateOfBirth).toLocaleDateString()}</p>
        )}
        {currentUser.address?.city && (
          <p><strong>Address:</strong> {`${currentUser.address.city}, ${currentUser.address.state}, ${currentUser.address.country}`}</p>
        )}
      </motion.div>

      {/* Role-Specific Sections */}
      <div className="mt-8 space-y-6">
        {currentUser.role === "learner" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">🎓 Learner Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg shadow">
              {currentUser.qualification && <p><strong>Qualification:</strong> {currentUser.qualification} ({currentUser.qualificationStatus})</p>}
              {currentUser.degree && <p><strong>Degree:</strong> {currentUser.degree}</p>}
              {currentUser.profession && currentUser.privacySettings?.showProfession && (
                <p><strong>Profession:</strong> {currentUser.profession}</p>
              )}
              {currentUser.organization?.name && <p><strong>Organization:</strong> {currentUser.organization.name}</p>}
              {currentUser.interests && <p><strong>Interests:</strong> {currentUser.interests}</p>}
            </div>
            {enrolledCourses.length > 0 && (
              <div className="mt-4">
                <EnrolledCourses enrolledCourses={enrolledCourses} />
              </div>
            )}
          </motion.div>
        )}

        {(currentUser.role === "examinee" || currentUser.role === "learner") && results?.length > 0 && (
          <ExamResults results={results} />
          
        )}

        {currentUser.role === "trainer" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">🧑‍🏫 Trainer Dashboard</h3>
            <div className="bg-yellow-50 p-4 rounded-lg shadow space-y-2">
              {currentUser.professionalTitle && <p><strong>Title:</strong> {currentUser.professionalTitle}</p>}
              {currentUser.totalExperience && <p><strong>Experience:</strong> {currentUser.totalExperience} years</p>}
              {currentUser.careerDescription && <p><strong>Career:</strong> {currentUser.careerDescription}</p>}
              {currentUser.socialLinks?.linkedIn && <p><strong>LinkedIn:</strong> {currentUser.socialLinks.linkedIn}</p>}
              {currentUser.socialLinks?.github && <p><strong>Github:</strong> {currentUser.socialLinks.github}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Link to="/courseForm"><button className="dashboard-btn">➕ Add Course</button></Link>
              <Link to="/create-exam"><button className="dashboard-btn">📝 Add Exam</button></Link>
              <Link to="/trainer-courses"><button className="dashboard-btn">📚 My Courses</button></Link>
              <Link to="/trainer-exams"><button className="dashboard-btn">📊 My Exams</button></Link>
            </div>
          </motion.div>
        )}

        {currentUser.role === "admin" && (
          <motion.div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-lg shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <h3 className="text-xl font-bold text-red-700 mb-2">🛠 Admin Dashboard</h3>
            {currentUser.accessLevel && <p><strong>Access Level:</strong> {currentUser.accessLevel}</p>}
            <Link to="/admin/dash">
              <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Go to Admin Panel</button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
