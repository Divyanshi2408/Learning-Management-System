const express = require("express");
const { getAdminStats, banUser, unbanUser } = require("../controllers/adminController");

const router = express.Router();

// ✅ Admin Stats Route
router.get("/stats", getAdminStats);

// ✅ Ban & Unban User Routes
router.put("/ban/:userId", banUser);
router.put("/unban/:userId", unbanUser);

module.exports = router;
