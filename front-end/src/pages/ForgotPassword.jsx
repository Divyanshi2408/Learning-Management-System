import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { forgotPassword, resetForgotPasswordState } from "../redux/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { forgotPasswordLoading, forgotPasswordMessage, forgotPasswordError } = useSelector(
    (state) => state.auth
  );

  // Clear any leftover status from a previous visit to this page
  useEffect(() => {
    dispatch(resetForgotPasswordState());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2">Forgot your password?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the email you registered with and we'll send you a link to reset your password.
        </p>

        {forgotPasswordMessage && (
          <p className="text-green-600 bg-green-50 border border-green-200 rounded-md p-3 mb-4 text-sm">
            {forgotPasswordMessage}
          </p>
        )}
        {forgotPasswordError && (
          <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm">
            {forgotPasswordError.message || "Something went wrong. Please try again."}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={forgotPasswordLoading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
