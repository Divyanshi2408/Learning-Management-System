const User = require("../models/User");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const mongoose = require("mongoose");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalExams = await Exam.countDocuments();

    res.json({ totalUsers, totalCourses, totalExams });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// ✅ Ban User
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = true;
    await user.save();

    res.json({ message: "User has been banned" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Failed to ban user" });
  }
};

// ✅ Unban User
const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isBanned) {
      return res.status(400).json({ message: "User is already unbanned" });
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: "User has been unbanned successfully" });
  } catch (error) {
    console.error("❌ Error unbanning user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getAdminStats, banUser, unbanUser };
