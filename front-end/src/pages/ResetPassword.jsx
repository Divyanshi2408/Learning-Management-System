import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { resetPassword, resetResetPasswordState } from "../redux/authSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { resetPasswordLoading, resetPasswordSuccess, resetPasswordError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(resetResetPasswordState());
  }, [dispatch]);

  useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success("Password reset successfully! Please log in.");
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [resetPasswordSuccess, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    dispatch(resetPassword({ token, newPassword }));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2">Set a new password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose a new password for your account. This link can only be used once.
        </p>

        {resetPasswordSuccess ? (
          <p className="text-green-600 bg-green-50 border border-green-200 rounded-md p-3 text-sm">
            Password reset successfully. Redirecting you to log in...
          </p>
        ) : (
          <>
            {(formError || resetPasswordError) && (
              <p className="text-red-500 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm">
                {formError || resetPasswordError.message || "This reset link is invalid or has expired."}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetPasswordLoading}
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
              >
                {resetPasswordLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
