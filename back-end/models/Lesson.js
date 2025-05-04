const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true }, // Cloudinary / Mux URL
    order: { type: Number }, // Lesson Order
    unlocked: { type: Boolean, default: false }, // Unlock after previous completion
    subtitles: { type: String }, // Optional
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
