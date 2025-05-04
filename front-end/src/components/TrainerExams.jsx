// TrainerExams.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreatedExams, deleteExam } from "../redux/examSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TrainerExams = () => {
  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((state) => state.exam);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCreatedExams());
  }, [dispatch]);

  const handleDelete = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      dispatch(deleteExam(examId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
        📘 Created Exams
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && exams.length === 0 && (
        <p className="text-center text-gray-500">No exams created yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <motion.div
            key={exam._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow hover:shadow-xl border border-gray-100"
          >
            <h3 className="text-xl font-bold text-purple-700 mb-2">{exam.title}</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Subject:</strong> {exam.subject}</p>
              <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {exam.duration} minutes</p>
              <p><strong>Total Marks:</strong> {exam.totalMarks}</p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate(`/exams/edit/${exam._id}`)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                ✏️ Edit Exam
              </button>
              <button
                onClick={() => handleDelete(exam._id)}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                🗑️ Delete Exam
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrainerExams;
