const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["learner", "trainer", "examinee", "admin"], required: true },
    profilePicture: { type: String, default: "" },
    tokens: [{ token: String, createdAt: { type: Date, default: Date.now } }], // ✅ Store JWT token here

    // Common fields
    phoneNumber: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    address: {
        local: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
    },

    // Learner-Specific Fields
    qualification: { type: String }, // Graduate, Post Graduate, etc.
    degree: { type: String }, // Engineering, Arts, etc.
    qualificationStatus: {
        type: String,
        enum: ["Pursuing", "Completed"],
        default: "Pursuing", // ✅ Set a default value
        required: function () { return this.role === "learner"; } // Required only for learners
    },
    profession: { type: String }, // Student, Working Professional, etc.
    organization: { name: String, address: String },
    interests: { type: String },

    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],

    enrolledExams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    }],
    // Examiner-Specific Fields
    canEnrollCourses: { type: Boolean, default: false }, // Cannot enroll unless upgraded

    // Trainer-Specific Fields
    professionalTitle: { type: String }, // Industry Expert, Professor, etc.
    totalExperience: { type: Number },
    socialLinks: {
        linkedIn: { type: String },
        github: { type: String },
        youtube: { type: String },
        twitter: { type: String },
    },
    careerDescription: { type: String },

    // Admin-Specific Fields
    accessLevel: {
        type: String,
        enum: ["Full Admin", "Content Manager", "Finance Manager"],
        default: "Full Admin", // ✅ Set a default value
        required: function () { return this.role === "admin"; } // Required only for admins
    },
    // Privacy Settings
    privacySettings: {
        showEmail: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: true },
        showProfession: { type: Boolean, default: true },
    },
    // ✅ Ban/Unban Feature
    isBanned: { type: Boolean, default: false }, // ✅ Banned users can't access the system
    // Soft Delete (for deactivation)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
