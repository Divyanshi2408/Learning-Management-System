import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { updateCourse } from "../redux/courseSlice";

const UpdateCourseModal = ({ course, isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [updatedData, setUpdatedData] = useState({
        title: course?.title || "",
        description: course?.description || "",
        category: course?.category || "",
        price: course?.price || 0,
        duration: course?.duration || "",
        level: course?.level || "Beginner",
        prerequisites: course?.prerequisites || "",
        certificationAvailable: course?.certificationAvailable || false,
        syllabus: course?.syllabus || [],
        lessons: course?.lessons || [],
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnail || "");

    const [lessonVideos, setLessonVideos] = useState({});
    const [lessonVideoPreviews, setLessonVideoPreviews] = useState({});

    // Handle text inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle Thumbnail Upload
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // Handle Lesson Video Upload
    const handleVideoChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            setLessonVideos((prev) => ({ ...prev, [index]: file }));
        }
    };

    // Handle syllabus updates
    const handleSyllabusChange = (index, field, value) => {
        setUpdatedData((prevData) => {
            const updatedSyllabus = [...prevData.syllabus];
            updatedSyllabus[index] = { ...updatedSyllabus[index], [field]: value };
            return { ...prevData, syllabus: updatedSyllabus };
        });
    };


    // Add new syllabus module
    // Add new syllabus module
    const addSyllabus = () => {
        setUpdatedData((prevData) => ({
            ...prevData,
            syllabus: [...prevData.syllabus, { title: "", description: "" }],
        }));
    };


    // Remove syllabus module
    const removeSyllabus = (index) => {
        setUpdatedData((prevData) => ({
            ...prevData,
            syllabus: prevData.syllabus.filter((_, i) => i !== index),
        }));
    };

    // Handle lesson updates
    // Handle Lesson Updates
    const handleLessonChange = (index, field, value) => {
        const updatedLessons = [...updatedData.lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setUpdatedData((prevData) => ({ ...prevData, lessons: updatedLessons }));
    };

    // Add a New Lesson
    const addLesson = () => {
        setUpdatedData((prevData) => ({
            ...prevData,
            lessons: [...prevData.lessons, { title: "", description: "", video: "" }],
        }));
    };

    // Remove lesson
    const removeLesson = (index) => {
        setUpdatedData((prevData) => ({
            ...prevData,
            lessons: prevData.lessons.filter((_, i) => i !== index),
        }));

        setLessonVideos((prev) => {
            const newVideos = { ...prev };
            delete newVideos[index];
            return newVideos;
        });

        setLessonVideoPreviews((prev) => {
            const newPreviews = { ...prev };
            delete newPreviews[index];
            return newPreviews;
        });
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", updatedData.title);
        formData.append("description", updatedData.description);
        formData.append("category", updatedData.category);
        formData.append("price", updatedData.price);
        formData.append("duration", updatedData.duration);
        formData.append("level", updatedData.level);
        formData.append("prerequisites", updatedData.prerequisites);
        formData.append("certificationAvailable", updatedData.certificationAvailable);
        formData.append("syllabus", JSON.stringify(updatedData.syllabus));

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }
        updatedData.lessons.forEach((lesson, index) => {
            formData.append(`lessons[${index}][title]`, lesson.title);
            formData.append(`lessons[${index}][description]`, lesson.description);

            if (lessonVideos[index]) {
                formData.append(`lessonVideos[${index}]`, lessonVideos[index]); // Append videos correctly
            } else {
                formData.append(`lessons[${index}][video]`, lesson.video);
            }
        });


        // Dispatch Redux action to update the course
        await dispatch(updateCourse({ courseId: course._id, updatedData: formData }));
        onClose();
    };

    if (!isOpen) return null;

    return (
        
        <div className="fixed inset-0 z-50 flex items-center text-black justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Update Course</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Title</label>
                        <input type="text" name="title" value={updatedData.title} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Category</label>
                        <input type="text" name="category" value={updatedData.category} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Price ($)</label>
                        <input type="number" name="price" value={updatedData.price} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>

                    {/* Duration */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Duration (e.g., 6 weeks)</label>
                        <input type="text" name="duration" value={updatedData.duration} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>

                    {/* Level */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Level</label>
                        <select name="level" value={updatedData.level} onChange={handleChange} className="w-full p-2 border rounded-md">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Prerequisites */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Prerequisites</label>
                        <input type="text" name="prerequisites" value={updatedData.prerequisites} onChange={handleChange} className="w-full p-2 border rounded-md" />
                    </div>

                    {/* Certification Available */}
                    <div className="mb-3 flex items-center">
                        <input type="checkbox" name="certificationAvailable" checked={updatedData.certificationAvailable} onChange={handleChange} className="mr-2" />
                        <label className="text-sm">Certification Available</label>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full p-2 border rounded-md" />
                        {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
                    </div>
                    {/* Lessons Section */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Lessons</h3>

                        {updatedData.lessons.map((lesson, index) => (
                            <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-semibold">Lesson {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeLesson(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <label className="block text-sm font-medium">Lesson Title</label>
                                <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                                    className="w-full p-2 border rounded-md mb-2"
                                />

                                <label className="block text-sm font-medium">Lesson Description</label>
                                <textarea
                                    value={lesson.description}
                                    onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                                    className="w-full p-2 border rounded-md mb-2"
                                />

                                <label className="block text-sm font-medium">Upload Lesson Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleVideoChange(index, e)}
                                    className="w-full p-2 border rounded-md"
                                />
                                {lessonVideoPreviews[index] && (
                                    <video src={lessonVideoPreviews[index]} controls className="mt-2 w-48 rounded-md" />
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => addLesson()}
                            className="bg-green-500 text-white text-sm px-3 py-1 rounded-md"
                        >
                            Add Lesson
                        </button>
                    </div>
                    {/* Syllabus Section */}
                    {updatedData.syllabus.map((item, index) => (
                        <div key={index} className="mb-4 border p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Module {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeSyllabus(index)}
                                    className="text-red-500 text-sm"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Module Title Input */}
                            <label className="block text-sm font-medium">Module Title</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleSyllabusChange(index, "title", e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter module title"
                            />

                            {/* Module Description Input */}
                            <label className="block text-sm font-medium mt-2">Module Description</label>
                            <textarea
                                value={item.description}
                                onChange={(e) => handleSyllabusChange(index, "description", e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter module description"
                            />
                        </div>
                    ))}

                    {/* Add New Module Button */}
                    <button
                        type="button"
                        onClick={addSyllabus}
                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md mb-4"
                    >
                        Add Module
                    </button>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateCourseModal;
