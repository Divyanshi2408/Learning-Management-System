const User = require("../models/User");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary"); // Import Cloudinary

// ✅ Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get user by ID (Admin & User themselves)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔹 Requested User ID:", id);
        console.log("🔹 Authenticated User:", req.user);

        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Ensure ObjectId format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const user = await User.findById(id).select("-password");
        console.log("🔹 Retrieved User:", user);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            ...user.toObject(),
            isBanned: user.isBanned || false, // ✅ Ensure `isBanned` is sent
        });
    } catch (error) {
        console.error("🔴 Error retrieving user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Get current logged-in user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if the user has permission
//         if (req.user.id !== id && req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         let updates = { ...req.body };

//         // ✅ Handle profile picture upload
//         if (req.file) {
//             const uploadedFile = req.file;
//             updates.profilePicture = uploadedFile.path; // Cloudinary URL

//             // 🔴 Remove old profile picture from Cloudinary
//             const user = await User.findById(id);
//             if (user?.profilePicture) {
//                 const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
//                 await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
//             }
//         }

//         // ✅ Update user in database
//         const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

//         if (!updatedUser) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("🔴 Error updating user:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// // ✅ Partially update user (PATCH request)
// const partialUpdateUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if the user has permission
//         if (req.user.id !== id && req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         let updates = { ...req.body };

//         // ✅ Handle profile picture upload
//         if (req.file) {
//             const uploadedFile = req.file;
//             updates.profilePicture = uploadedFile.path; // Cloudinary URL

//             // 🔴 Remove old profile picture from Cloudinary
//             const user = await User.findById(id);
//             if (user?.profilePicture) {
//                 const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
//                 await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
//             }
//         }

//         // ✅ Update user with partial changes
//         const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");

//         if (!updatedUser) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("🔴 Error updating user:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 🛑 Prevent unauthorized updates
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // ❌ Prevent updating restricted fields
        const restrictedFields = ["_id", "role", "password", "tokens"];
        Object.keys(req.body).forEach((key) => {
            if (restrictedFields.includes(key)) {
                delete req.body[key];
            }
        });

        let updates = { ...req.body };

        // ✅ Handle profile picture upload (if provided)
        if (req.file) {
            const uploadedFile = req.file;
            updates.profilePicture = uploadedFile.path; // Save Cloudinary URL

            // 🔴 Remove old profile picture from Cloudinary
            const user = await User.findById(id);
            if (user?.profilePicture) {
                const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
                await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
            }
        }

        // ✅ Update user in database
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("🔴 Error updating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const partialUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 🛑 Check if the user has permission
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // ❌ Prevent updating restricted fields
        const restrictedFields = ["_id", "role", "password", "tokens"];
        Object.keys(req.body).forEach((key) => {
            if (restrictedFields.includes(key)) {
                delete req.body[key];
            }
        });

        let updates = { ...req.body };

        // ✅ Handle profile picture upload
        if (req.file) {
            const uploadedFile = req.file;
            updates.profilePicture = uploadedFile.path; // Save Cloudinary URL

            // 🔴 Remove old profile picture from Cloudinary
            const user = await User.findById(id);
            if (user?.profilePicture) {
                const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
                await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
            }
        }

        // ✅ Update user with partial changes
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("🔴 Error updating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Delete user (Admin & User themselves)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User account deactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getUsers, getUserById, getCurrentUser, updateUser, partialUpdateUser, deleteUser };
