import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById, enrollCourse, getEnrolledCourses } from "../redux/courseSlice";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCourse, loading, error, enrolledCourses } = useSelector(state => state.courses);
  const token = useSelector((state) => state.auth.token);
  const [showLessons, setShowLessons] = useState(false);
  const [expandedSyllabusIndex, setExpandedSyllabusIndex] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchCourseById(id));
    if (token) dispatch(getEnrolledCourses());  // Fetch enrolled courses
  }, [dispatch, id, token]);

  if (loading) return <p className="text-center text-lg">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!selectedCourse) return <p className="text-center">Course not found.</p>;

  const handleToggleLessons = () => {
    setShowLessons(!showLessons);
  };

  const toggleSyllabus = (index) => {
    setExpandedSyllabusIndex(expandedSyllabusIndex === index ? null : index);
  };

  const isAlreadyEnrolled = enrolledCourses?.some(course => course._id === selectedCourse._id);

  const handleEnroll = async () => {
    if (!token) {
      alert("Please login to enroll.");
      return;
    }

    if (isAlreadyEnrolled) {
      alert("You are already enrolled in this course.");
      return;
    }

    try {
      await dispatch(enrollCourse(selectedCourse._id)).unwrap();

      // ✅ Immediately update Redux state without needing a refresh
      dispatch(getEnrolledCourses());
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };


  return (
    <div className="max-w-full mx-auto mt-2 text-white">
      {/* <button
      onClick={() => navigate(-1)}
      className="mb-2 mx-6 px-4 py-1 bg-gray-800 text-white hover:bg-gray-700 rounded transition"
    >
      ← Back
    </button> */}

      {/* Header Section */}
      <div className="grid grid-cols-1 text-white md:grid-cols-5 gap-5 p-6 bg-white shadow-lg border border-gray-200 bg-gradient-to-r from-blue-700 to-blue-500
">
        {/* Course Information */}
        <div className="col-span-1 md:col-span-3 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold ">
            {selectedCourse.title}
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {selectedCourse.description}
          </p>

          {/* Additional Details */}
          <div className="flex items-center gap-4 text-sm mt-3">
            <p>
              <strong>Category:</strong> {selectedCourse.category}
            </p>
            <p>
              <strong>Certification:</strong>{" "}
              {selectedCourse.certificationAvailable ? "Yes" : "No"}
            </p>
            <p>
              <strong>Duration: </strong>{selectedCourse.duration} Hrs
            </p>
            <p> <strong>Level: </strong> {selectedCourse.level || "Beginner"}</p>
          </div>

          {/* Prerequisites */}
          {selectedCourse.prerequisites && (
            <p className="text-sm mt-3">
              <strong>Prerequisites:</strong> {selectedCourse.prerequisites}
            </p>
          )}

          {/* Pricing and Enrollment */}
          <div className="mt-4">
            <div className="text-lg font-bold text-white">₹{selectedCourse.price || "449"}</div>
            {isAlreadyEnrolled ? (
              <button className="bg-white text-blue-700 px-5 py-2 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white cursor-not-allowed">
                Already Enrolled
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="bg-white text-blue-700 px-5 py-2 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
          </div>
        </div>


        {/* Course Thumbnail on the Right Side */}
        <div className="col-span-1 md:col-span-2 relative w-full h-52 md:h-60 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
          <img
            src={selectedCourse.thumbnail || "https://via.placeholder.com/800x400"}
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>


      {/* Show Lessons Button */}
      <div className="mt-6 mx-6">

        <button
          onClick={handleToggleLessons}
          className="bg-blue-600 text-white font-bold px-4 py-2 hover:bg-blue-700 transition-all"
        >
          {showLessons ? "Hide Lessons" : "Show Lessons"}
        </button>

        {showLessons && (
          <div className="mt-8 text-black">
            {/* Course Lessons Heading */}

            <h2 className="text-3xl font-bold">Lessons</h2>

            {selectedCourse?.lessons?.length > 0 ? (
              <div className="space-y-6">
                {selectedCourse.lessons.map((lesson, index) => {
                  const isSample = index === 0;
                  const canAccess = isAlreadyEnrolled || isSample;

                  return (
                    <div
                      key={lesson._id}
                      className="border border-blue-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {/* Lesson Header */}
                      <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500">
                        <h4 className="text-lg font-semibold text-white">
                          Lesson {index + 1}: {lesson.title}
                          {isSample && !isAlreadyEnrolled && (
                            <span className="ml-2 text-sm bg-yellow-300 text-black px-2 py-1 rounded-full">Sample</span>
                          )}
                        </h4>
                      </div>

                      {/* Lesson Content */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center">
                        {/* Lesson Info */}
                        <div className="col-span-1 md:col-span-2 flex flex-col justify-center">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {lesson.title}
                          </h4>
                          {lesson.description && (
                            <p className="text-gray-600 text-base">{lesson.description}</p>
                          )}
                        </div>

                        {/* Video Section */}
                        <div className="col-span-1 md:col-span-3 flex justify-center items-center">
                          {canAccess ? (
                            <video
                              src={lesson.videoUrl}
                              controls
                              className="w-full md:w-[95%] h-auto max-w-[800px] rounded-md shadow-md"
                            />
                          ) : (
                            <div className="w-full h-[200px] flex items-center justify-center bg-gray-200 text-gray-600 rounded-md shadow-inner text-lg font-semibold">
                              🔒 Enroll to unlock this lesson
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-lg text-center text-gray-500 bg-gray-100 py-4 rounded-lg">
                🚫 No lessons available for this course.
              </p>
            )}


          </div>
        )}



      </div>

      {/* Syllabus Section */}
      <div className="mt-8 mx-6">
        <h3 className="text-3xl font-bold mb-5 text-gray-900">Syllabus</h3>
        <div className="space-y-4">
          {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 ? (
            selectedCourse.syllabus.map((module, index) => (
              <div
                key={index}
                className="border border-gray-300 p-5 m-5 rounded-lg bg-gray-50 hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleSyllabus(index)}
                  className="w-full text-left font-semibold text-lg flex justify-between items-center focus:outline-none"
                >
                  <span className="text-gray-900">{module.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">Module Details</span>
                    <span className="text-gray-600">
                      {expandedSyllabusIndex === index ? "▲" : "▼"}
                    </span>
                  </div>
                </button>
                {expandedSyllabusIndex === index && (
                  <div className="mt-3 text-gray-700 transition-all duration-300">
                    <p className="mt-2 bg-gray-100 p-4 rounded-lg">
                      {module.description}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-lg">No syllabus available.</p>
          )}
        </div>
      </div>
    </div>

  );
};

export default CourseDetails;