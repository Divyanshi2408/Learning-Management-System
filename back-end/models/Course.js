const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        thumbnail: { type: String }, // Cloudinary URL
        price: { type: Number, default: 0 }, // 0 for free courses
        duration: { type: Number }, // Total hours
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Lessons
        prerequisites: [String], // List of prerequisites
        courseLevel: { 
            type: String, 
            enum: ["Beginner", "Intermediate", "Advance"], 
            default: "Beginner" 
        },
        certificationAvailable: { type: Boolean, default: false },
        reviews: [{ 
            userId: mongoose.Schema.Types.ObjectId, 
            comment: String, 
            rating: Number 
        }],

        // Approval workflow
        status: { 
            type: String, 
            enum: ["pending", "approved", "rejected"], 
            default: "pending" 
        },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who approved
        approvalDate: { type: Date },
        rejectionReason: { type: String }, // If rejected, store reason
        trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Trainer reference
        
        syllabus: [{ 
            title: { type: String, required: true },
            description: { type: String, required: true }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
