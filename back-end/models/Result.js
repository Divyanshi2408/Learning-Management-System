const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  examType: { type: String, required: true }, // ✅ Store examType directly
  obtainedMarks: Number,
  correctAnswers: Number,
  incorrectAnswers: Number,
  totalQuestions: Number,
  percentage: Number,
  passed: Boolean,
  certificateUrl: { type: String }, // ✅ Store Cloudinary URL if needed
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
