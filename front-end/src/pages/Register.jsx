import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState, loginUser } from "../redux/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"

function Register({ isOpen, onClose, onLoginClick }) {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "learner", // Default role
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    qualification: "",
    degree: "",
    qualificationStatus: "",
    profession: "",
    organization: "",
    interests: "",
    professionalTitle: "",
    totalExperience: "",
    socialLinks: {
      linkedIn: "",
      github: "",
      youtube: "",
      twitter: "",
    },
    careerDescription: "",
    accessLevel: "",
    canEnrollCourses: false,
    profilePicture: "",
  });

  useEffect(() => {
    if (success) {
      toast.success("User Registered successfully!");
      // Auto-login after successful registration
      dispatch(loginUser({ email: formData.email, password: formData.password }));
      onClose();
      dispatch(resetAuthState());
    }
  }, [success, dispatch, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("socialLinks")) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_preset");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/drhk6uycr/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setFormData((prev) => ({ ...prev, profilePicture: data.secure_url })); // Cloudinary image URL
        setImagePreview(data.secure_url);
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Register</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            {error && <p className="text-red-500">{error.message}</p>}

            <form onSubmit={handleSubmit}>
              {(
                <>
                  

                  {/* Full Name */}
                  
                  {/* Username */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium">Role</label>
                    <select
                      name="role"
                      className="w-full p-2 border rounded-md"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="learner">Learner</option>
                      <option value="examinee">Examinee</option>
                      <option value="trainer">Trainer</option>
                    </select>
                  </div>


                  {/* Email */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>


                </>
              )}
            </form>

            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <button
                onClick={onLoginClick}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Register;
