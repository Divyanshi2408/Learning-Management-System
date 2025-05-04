const mongoose = require("mongoose");
const examSchema = new mongoose.Schema({
  title: String,
  code: String,
  subject: String,
  category: String,
  timeLimit: Number,
  numQuestions: Number,
  totalMarks: Number,
  type: { type: String, enum: ["Practice Test", "Certification Exam"] },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  certificateTemplate: String,
  randomized: Boolean,
  sections: [{ name: String, timeLimit: Number }],
  accessCodes: [String],
  expiryDate: Date,
  attemptsLimit: Number,
  restrictCopyPaste: Boolean,
});
module.exports = mongoose.model("Exam", examSchema);


// const mongoose = require("mongoose");

// const examSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   code: String,
//   subject: String,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Link to Category
//   timeLimit: Number,
//   numQuestions: Number,
//   totalMarks: Number,
//   type: { type: String, enum: ["Practice Test", "Certification Exam"] },
//   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   randomized: Boolean,
//   sections: [{ name: String, timeLimit: Number }],
//   accessCodes: [String],
//   expiryDate: Date,
//   attemptsLimit: Number,
//   restrictCopyPaste: Boolean,
// }, { timestamps: true });

// module.exports = mongoose.model("Exam", examSchema);
