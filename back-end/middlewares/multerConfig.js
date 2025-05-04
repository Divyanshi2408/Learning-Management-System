const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// ✅ Dynamic Storage Based on File Type
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "general_uploads";
    let resourceType = "raw"; // Cloudinary treats CSV as "raw" files

    if (file.mimetype.startsWith("image/")) {
      folder = req.baseUrl.includes("/courses") ? "course_images" : "user_profiles";
      return {
        folder,
        format: file.mimetype.split("/")[1], 
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "image"
      };
    }

    if (file.mimetype.startsWith("video/")) {
      folder = "lesson_videos";
      return {
        folder,
        format: "mp4",
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "video"
      };
    }

    if (file.mimetype === "text/csv") {
      folder = "exam_questions"; // Store CSV files in a dedicated folder
      return {
        folder,
        format: "csv",
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "raw"
      };
    }

    throw new Error("Invalid file type");
  },
});

// ✅ Handle CSV Uploads Along with Other Files
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 50 MB max file size
});

module.exports = {
  uploadSingle: upload.single("profilePicture"),
  uploadCourseFiles: upload.fields([
    { name: "thumbnail", maxCount: 1 },
    // { name: "bannerImage", maxCount: 1 },
    { name: "lessonVideos", maxCount: 50 },
  ]),
  uploadCSV: upload.single("file"), // ✅ Add this for CSV uploads
};
