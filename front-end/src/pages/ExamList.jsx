import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExams, enrollExam } from "../redux/examSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ExamList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, status, error } = useSelector((state) => state.exam);
  const { user } = useSelector((state) => state.auth);

  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExams());
    }
  }, [dispatch, status]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on new search
  };

  const handleEnroll = (examId, isEnrolled) => {
    if (isEnrolled) {
      navigate(`/exam/start/${examId}`);
    } else {
      dispatch(enrollExam(examId))
        .unwrap()
        .then(() => {
          toast.success("Successfully enrolled in the exam!");
          navigate(`/exam/start/${examId}`);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to enroll.");
        });
    }
  };

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchType = selectedType === "All" || exam.type === selectedType;
    const matchSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  // Pagination logic
  const indexOfLast = currentPage * examsPerPage;
  const indexOfFirst = indexOfLast - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Available Exams
      </motion.h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search exams by title..."
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["All", "Practice Test", "Certification Exam"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition shadow ${selectedType === type
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      {currentExams.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No exams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentExams.map((exam) => (
            <motion.div
              key={exam._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">Code: {exam.code}</p>
                <p className="text-sm text-gray-500 mb-1">Subject: {exam.subject}</p>
                <p className="text-sm text-gray-500 mb-1">Category: {exam.category}</p>
                <p className="text-sm text-gray-500 mb-1">Time Limit: {exam.timeLimit} min</p>
                <p className="text-sm text-gray-500 mb-1">Questions: {exam.numQuestions}</p>
                <p className="text-sm text-gray-500 mb-3">Marks: {exam.totalMarks}</p>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {exam.type}
                </span>
              </div>

              <div className="mt-5">
                {(user?.role === "examinee" ||
                  user?.role === "trainer" ||
                  user?.role === "learner" ||
                  user?.role === "admin") ? (
                  <button
                  onClick={() => navigate(`/exam/start/${exam._id}`)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Start Exam
                  </button>
                ) : (
                  <p className="text-sm text-gray-400 text-center">Not authorized</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : " text-white bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Next
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
      )}

    </div>
  );
};

export default ExamList;
