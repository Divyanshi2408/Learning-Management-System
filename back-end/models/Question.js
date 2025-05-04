const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    text: String,
    options: [String],
    correctAnswer: String,
    marks: Number,
    negativeMarking: Number,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    explanation: String,
  });
  module.exports = mongoose.model("Question", questionSchema);