// const express = require("express");
// const { createLesson, deleteLesson, updateLesson } = require("../controllers/lessonController");
// const protect = require("../middlewares/authMiddleware");
// const upload = require("../middlewares/multerConfig");

// const router = express.Router();

// // ✅ Create Lesson for a Course (Trainer Only)
// router.post(
//     "/create-lesson",
//     protect(["trainer"]),
//     upload.single("video"), // Upload video using multer
//     createLesson
// );

// // ✅ Update Lesson (Trainer Only)
// router.put("/:lessonId", protect(["trainer"]), updateLesson);

// // ✅ Delete Lesson (Trainer Only)
// router.delete("/:lessonId", protect(["trainer"]), deleteLesson);

// module.exports = router;

const express = require("express");
const { 
    createLesson, 
    deleteLesson, 
    // updateLesson 
} = require("../controllers/lessonController");

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");

const router = express.Router();

// ✅ Create Lesson for a Course (Trainer Only)
router.post(
    "/create/:courseId",
    protect(["trainer"]),
    upload.single("video"), // Upload only video file using multer
    createLesson
);

// // ✅ Update Lesson by ID (Trainer Only)
// router.put(
//     "/update/:lessonId",
//     protect(["trainer"]),
//     upload.single("video"), // Optional: If trainer wants to update the video
//     updateLesson
// );

// ✅ Delete Lesson by ID (Trainer Only)
router.delete(
    "/delete/:lessonId",
    protect(["trainer"]),
    deleteLesson
);

module.exports = router;
