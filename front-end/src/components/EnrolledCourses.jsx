import React, { useState } from "react";
import { Link } from "react-router-dom";

const EnrolledCourses = ({ enrolledCourses }) => {
  const coursesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(enrolledCourses.length / coursesPerPage);
  const currentCourses = enrolledCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">📚 My Enrolled Courses</h3>

      {currentCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <div
            key={course._id}
            className="flex flex-col justify-between p-5 bg-white rounded-xl border border-blue-200 shadow-md hover:shadow-xl transition"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">{course.description}</p>
              <p className="text-xs text-green-600">
                ✅ Enrolled on: {new Date(course.enrolledDate).toLocaleDateString()}
              </p>
            </div>
          
            <Link
              to={`/CourseDetails/${course._id}`}
              className="mt-4 self-start px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
            >
              📖 Go to Course
            </Link>
          </div>          
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">You haven't enrolled in any courses yet.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <span className="font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
