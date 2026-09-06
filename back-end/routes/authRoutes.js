const express = require("express");
const { uploadSingle } = require("../middlewares/multerConfig"); // ✅ Import single file upload
const { registerUser, loginUser, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", uploadSingle, registerUser);
router.post("/login", loginUser);
router.post("/change-password", protect(), changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
