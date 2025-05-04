import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../redux/authSlice";
import { toast } from "react-toastify";

function Login({ isOpen, onClose, onRegisterClick }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      if (error?.includes("banned")) {
        toast.warning("Your account is banned. Please contact support.");
        return;
      }
      toast.success("Login successfully!");
      onClose(); // ✅ Close modal
      dispatch(resetAuthState()); // ✅ Reset auth state
    }
  }, [success, dispatch, onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  if (!isOpen) return null; // ✅ Ensure modal doesn't render when `isOpen` is false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>

        {error && <p className="text-red-500">{error.message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded-md bg-white/50 backdrop-blur-md"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded-md bg-white/50 backdrop-blur-md"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 text-center text-sm"
        >
          <p>
            Don't have an account?{" "}
            <button onClick={onRegisterClick} className="text-blue-600 underline">
              Register
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
