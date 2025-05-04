import React, { useState } from "react";
import { motion } from "framer-motion";

const ExamResults = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;

  const sortedResults = [...results].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const displayedResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-2xl shadow-md">
      <h3 className="text-3xl font-bold text-center text-purple-800 mb-6">📊 Exam Results</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedResults.map((result) => (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-5 bg-white rounded-xl shadow hover:shadow-lg border border-purple-200"
          >
            <h4 className="text-lg font-semibold text-purple-800 mb-2">
              🎯 {result.examTitle || "Exam Name Not Available"}
            </h4>
            <p className="text-sm text-purple-600 font-medium mb-1">
              📌 Exam Type: <span className="font-semibold">{result.examType || "N/A"}</span>
            </p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>📚 <strong>Obtained:</strong> {result.obtainedMarks}</p>
              <p>✅ <strong>Correct:</strong> {result.correctAnswers}</p>
              <p>❌ <strong>Incorrect:</strong> {result.incorrectAnswers}</p>
              <p>📝 <strong>Total Questions:</strong> {result.totalQuestions}</p>
              <p>📈 <strong>Percentage:</strong> {result.percentage}%</p>
            </div>
            <p className={`text-sm font-semibold mt-3 ${result.passed ? "text-green-600" : "text-red-600"}`}>
              {result.passed ? "🎉 Passed" : "❗ Failed"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ⏰ Submitted on: {new Date(result.submittedAt).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Prev
          </button>
          <span className="font-semibold text-purple-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
