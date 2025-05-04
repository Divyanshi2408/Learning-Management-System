const express = require("express");
const { getUsers, getUserById, getCurrentUser, updateUser, partialUpdateUser, deleteUser } = require("../controllers/userController");
const { uploadSingle } = require("../middlewares/multerConfig"); // Import multer middleware
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect(["admin"]), getUsers);
router.get("/me", protect(["admin", "learner", "trainer", "examinee"]), getCurrentUser);
router.get("/:id", protect(["admin"]), getUserById);
router.put("/:id", protect(["admin", "learner", "trainer", "examinee"]), uploadSingle, updateUser); // ✅ Allow file uploads
router.patch("/:id", protect(["admin", "learner", "trainer", "examinee"]), uploadSingle, partialUpdateUser);
router.delete("/:id", protect(["admin", "learner", "trainer", "examinee"]), deleteUser);

module.exports = router;
