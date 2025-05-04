const Exam = require("../models/Exam");
const Question = require("../models/Question");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream"); // ✅ To upload from memory
const Result = require("../models/Result"); // Ensure you have the correct model
const mongoose = require("mongoose");
const path = require("path");

exports.createExam = async (req, res) => {


  if (!req.user) {
    return res.status(403).json({ error: "Unauthorized request" });
  }

  if (req.user.role !== "trainer") {
    return res.status(403).json({ error: "Only trainers can create exams" });
  }

  try {
    const exam = new Exam({ ...req.body, createdBy: req.user.id });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.addQuestions = async (req, res) => {
//   if (req.user.role !== "trainer") {
//     return res.status(403).json({ error: "Only trainers can add questions" });
//   }

//   try {
//     const { examId, questions } = req.body;
//     const exam = await Exam.findById(examId);
//     if (!exam) return res.status(404).json({ error: "Exam not found" });

//     const questionDocs = await Question.insertMany(
//       questions.map((q) => ({ ...q, exam: examId }))
//     );

//     // ✅ Link questions to the Exam
//     exam.questions.push(...questionDocs.map((q) => q._id));
//     await exam.save(); // ✅ Ensure questions are added to the exam

//     res.status(201).json({ message: "Questions added successfully", questions: questionDocs });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.addQuestions = async (req, res) => {
//   // Check if user is valid
//   if (!req.user || req.user.role !== "trainer") {
//     return res.status(403).json({ error: "Only trainers can add questions" });
//   }

//   try {
//     const { examId, questions } = req.body;

//     // Validate data
//     if (!examId || !Array.isArray(questions) || questions.length === 0) {
//       return res.status(400).json({ error: "Invalid examId or questions data" });
//     }

//     // Check if exam exists
//     const exam = await Exam.findById(examId);
//     if (!exam) return res.status(404).json({ error: "Exam not found" });

//     // Add questions to the database
//     const questionDocs = await Question.insertMany(
//       questions.map((q) => {
//         const { _id, ...rest } = q; // ✅ Remove _id if it exists
//         return { ...rest, exam: examId };
//       })
//     );
    

//     // Check and update exam questions
//     if (!Array.isArray(exam.questions)) {
//       exam.questions = [];
//     }
//     exam.questions.push(...questionDocs.map((q) => q._id));
//     await exam.save(); // Save updated exam

//     res
//       .status(201)
//       .json({ message: "Questions added successfully", questions: questionDocs });
//   } catch (err) {
//     console.error(err); // Log for debugging
//     res.status(500).json({ error: err.message });
//   }
// };

exports.addQuestions = async (req, res) => {
  // Check if user is valid
  if (!req.user || req.user.role !== "trainer") {
    return res.status(403).json({ error: "Only trainers can add questions" });
  }

  try {
    const { examId, questions } = req.body;

    // Validate data
    if (!examId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Invalid examId or questions data" });
    }

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const updatedQuestions = [];

    // ✅ Loop through each question and update or insert
    for (const q of questions) {
      if (q._id) {
        // ✅ If _id exists, update the question
        const updatedQuestion = await Question.findByIdAndUpdate(
          q._id,
          { ...q, exam: examId }, // Keep examId associated
          { new: true, runValidators: true }
        );
        updatedQuestions.push(updatedQuestion);
      } else {
        // ✅ If no _id, create a new question
        const newQuestion = new Question({ ...q, exam: examId });
        await newQuestion.save();
        updatedQuestions.push(newQuestion);
      }
    }

    // ✅ Update exam questions with updated/new question IDs
    exam.questions = updatedQuestions.map((q) => q._id);
    await exam.save();

    res.status(201).json({
      message: "Questions added/updated successfully",
      questions: updatedQuestions,
    });
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: err.message });
  }
};


exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate({
      path: "questions", // Ensure it fetches related questions
      model: "Question",
    });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    res.json(exam.questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Delete an Exam
exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // ✅ Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // ✅ Ensure only the trainer who created it or an admin can delete
    if (req.user.role !== "admin" && exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this exam" });
    }

    // ✅ Delete all associated questions
    await Question.deleteMany({ exam: examId });

    // ✅ Delete the exam
    await Exam.findByIdAndDelete(examId);

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // ✅ Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // ✅ Find the exam to remove the question reference
    const exam = await Exam.findById(question.exam);
    if (exam) {
      exam.questions = exam.questions.filter(
        (q) => q.toString() !== questionId
      );
      await exam.save();
    }

    // ✅ Delete the question
    await Question.findByIdAndDelete(questionId);

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateExam = async (req, res) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ error: "Only trainers can update exams" });
  }

  try {
    const { examId } = req.params;
    const updatedData = req.body;

    const exam = await Exam.findByIdAndUpdate(examId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json({ message: "Exam updated successfully", exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateQuestion = async (req, res) => {
//   if (req.user.role !== "trainer") {
//     return res.status(403).json({ error: "Only trainers can update questions" });
//   }

//   try {
//     const { questionId } = req.params;
//     const updatedData = req.body;

//     const question = await Question.findByIdAndUpdate(questionId, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     res.status(200).json({ message: "Question updated successfully", question });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateQuestion = async (req, res) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ error: "Only trainers can update questions" });
  }

  try {
    const { questionId } = req.params;
    const updatedData = req.body;

    const question = await Question.findByIdAndUpdate(questionId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.enrollExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // ✅ Find the exam by ID
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // ✅ Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Check if user is a learner or examinee (Fixed Condition)
    if (user.role !== "learner" && user.role !== "examinee") {
      return res.status(403).json({ success: false, message: "Only learners and examinees can enroll in exams" });
    }

    // ✅ Check if already enrolled
    if (user.enrolledExams.includes(examId)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this exam" });
    }

    // ✅ Enroll user in the exam
    user.enrolledExams.push(examId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled in exam successfully",
      enrolledExams: user.enrolledExams
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEnrolledExams = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Get the user with enrolled exams populated
    const user = await User.findById(userId)
      .populate({
        path: "enrolledExams",
        select: "title description category trainer",
        populate: { path: "trainer", select: "fullName" } // Fetch trainer details
      })
      .select("fullName enrolledExams");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled exams fetched successfully",
      enrolledExams: user.enrolledExams
    });

  } catch (error) {

    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitResult = async (req, res) => {
  try {
    const { examId, result } = req.body;
    if (!result || !examId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { obtainedMarks, correct, incorrect, totalQuestions } = result;
    if (obtainedMarks === undefined || correct === undefined || incorrect === undefined || totalQuestions === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Fetch Exam Details to Get `examType`
    const exam = await Exam.findById(examId);
    if (!exam || !exam.type || exam.totalMarks === undefined) {
      return res.status(400).json({ error: "Exam details not found or invalid" });
    }

    const passingMarks = exam.totalMarks * 0.4;
    const passed = obtainedMarks >= passingMarks;

    // ✅ Update existing result or create a new one
    const updatedResult = await Result.findOneAndUpdate(
      { user: req.user.id, exam: examId },  // Find by user & exam
      { 
        $set: { 
          examType: exam.type, // ✅ Store `examType`
          obtainedMarks, 
          correctAnswers: correct, 
          incorrectAnswers: incorrect, 
          totalQuestions, 
          percentage: (correct / totalQuestions) * 100, 
          passed 
        } 
      },
      { new: true, upsert: true } // ✅ Return updated result & create if missing
    );

    res.status(201).json({ message: "Result submitted successfully", result: updatedResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getSubmittedResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate("exam", "title code subject totalMarks type") // ✅ Populate `examType`
      .sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No results found." });
    }

    // ✅ Include `examType` in the response
    const formattedResults = results.map((result) => ({
      _id: result._id,
      examTitle: result.exam?.title || "Unknown Exam",
      examType: result.exam?.type || "N/A", // ✅ Include examType
      obtainedMarks: result.obtainedMarks || 0,
      correctAnswers: result.correctAnswers || 0,
      incorrectAnswers: result.incorrectAnswers || 0,
      totalQuestions: result.totalQuestions || 0,
      percentage: result.percentage || 0,
      passed: result.passed || false,
      submittedAt: result.submittedAt || result.createdAt,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCreatedExams = async (req, res) => {
  try {
    if (!["trainer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Only trainers and admins can view created exams." });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ✅ Include `examType` in the response
    const createdExams = await Exam.find({ createdBy: userId })
      .populate("questions", "text options correctAnswer") 
      .select("title code subject totalMarks examType") // ✅ Select `examType`
      .sort({ createdAt: -1 });

    res.json(createdExams);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.generateCertificate = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Fetch user details
    const user = await User.findById(userId).select("fullName");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch exam result
    const result = await Result.findOne({ exam: examId, user: userId }).populate("exam", "title totalMarks");
    if (!result) {
      return res.status(403).json({ success: false, message: "No exam result found" });
    }
    if (!result.passed) {
      return res.status(403).json({ success: false, message: "You are not eligible for a certificate" });
    }

    // Generate PDF
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
    let pdfBuffer = [];

    doc.on("data", (chunk) => pdfBuffer.push(chunk));
    doc.on("end", async () => {
      const buffer = Buffer.concat(pdfBuffer);
      const stream = Readable.from(buffer);

      // Upload to Cloudinary
      cloudinary.uploader.upload_stream(
        {
          folder: "certificates",
          public_id: `certificate_${userId}_${examId}`,
          resource_type: "raw",
          format: "pdf",
        },
        async (error, uploadResult) => {
          if (error) {
            return res.status(500).json({ success: false, message: "Certificate upload failed" });
          }

          await Result.findByIdAndUpdate(result._id, { certificateUrl: uploadResult.secure_url }, { new: true });

          return res.status(200).json({
            success: true,
            message: "Certificate generated successfully",
            certificateUrl: uploadResult.secure_url,
          });
        }
      ).end(buffer);
    });

    // Draw border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#000");

    // Header
    doc.fontSize(26).text("Certificate of Achievement", { align: "center", underline: true });
    doc.moveDown();
    doc.image(path.join(__dirname, "../public/images/DevDojoLogo.png"), 20, 20, { width: 100 });
    // Recipient name
    doc.moveDown();
    doc.fontSize(18).text("This is awarded to", { align: "center" });
    doc.moveDown();
    doc.fontSize(28).text(`${user.fullName}`, { align: "center", bold: true });
    doc.moveDown();
    
    // Exam details
    doc.fontSize(18).text(`For successfully passing the "${result.exam.title}" examination.`, { align: "center" });
    doc.moveDown();
    doc.text(`Score: ${result.obtainedMarks}/${result.exam.totalMarks}`, { align: "center" });
    doc.moveDown();
    doc.text(`Awarded on: ${new Date().toLocaleDateString()}`, { align: "center" });

    // Signature area
    doc.moveDown(2);
    doc.text("______________________", 150, doc.page.height - 100);
    doc.text("Authorized Signature", 150, doc.page.height - 80);

    doc.text("______________________", doc.page.width - 300, doc.page.height - 100);
    doc.text("Exam Supervisor", doc.page.width - 300, doc.page.height - 80);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating certificate" });
  }
};
