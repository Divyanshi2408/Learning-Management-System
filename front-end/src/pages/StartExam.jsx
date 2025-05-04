import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExamQuestions,
  submitResult,
  generateCertificate,
} from "../redux/examSlice";

const StartExam = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const exams = useSelector((state) => state.exam.exams);
  const exam = exams.find((e) => e._id === examId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam?.timeLimit * 60 || 0);
  const navigate = useNavigate();
  const { certificateUrl, status } = useSelector((state) => state.exam);

  useEffect(() => {
    if (!exam || !exam.questions) {
      dispatch(fetchExamQuestions(examId));
    }
  }, [dispatch, examId, exam]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setTimeUp(true);
    }
  }, [timeLeft, showResult]);

  if (!exam) return <div className="flex items-center justify-center h-screen text-gray-600">Loading Exam...</div>;
  if (!exam.questions || exam.questions.length === 0) return <div className="flex items-center justify-center h-screen text-red-500">No questions available.</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion._id]: option }));
  };

  const handleSubmitResult = () => {
    const correctAnswers = exam.questions.reduce((acc, q) => {
      acc[q._id] = q.correctAnswer;
      return acc;
    }, {});
    const marksPerQuestion = exam.totalMarks / exam.questions.length;
    const correct = Object.keys(selectedAnswers).filter((key) => selectedAnswers[key] === correctAnswers[key]).length;
    const incorrect = Object.keys(selectedAnswers).length - correct;
    const obtainedMarks = correct * marksPerQuestion;

    dispatch(
      submitResult({
        examId,
        result: { selectedAnswers, correct, incorrect, obtainedMarks, totalQuestions: exam.questions.length },
      })
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitResult();
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleGenerateCertificate = () => dispatch(generateCertificate(examId));

  const formatTime = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="flex max-w-7xl mx-auto mt-10">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 rounded-lg shadow h-fit sticky top-10">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {exam.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold shadow transition-all ${
                index === currentQuestionIndex ? "bg-blue-600 text-white" : selectedAnswers[exam.questions[index]._id] ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-10 bg-white p-6 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{exam.title}</h2>
            <p className="text-gray-600">Exam Code: {exam.code}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-600 font-semibold">Time Left: {formatTime(timeLeft)}</p>
            <p className="text-sm text-gray-500">Total Marks: {exam.totalMarks}</p>
            <p className="text-sm text-gray-500">Questions: {exam.questions.length}</p>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold text-gray-700 mb-2">Question {currentQuestionIndex + 1} of {exam.questions.length}</h3>
        <p className="text-gray-800 font-medium mb-4">{currentQuestion?.text}</p>

        <div className="space-y-2">
          {currentQuestion?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition border ${selectedAnswers[currentQuestion._id] === option ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100 hover:bg-gray-200 border-gray-300"}`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition disabled:bg-gray-400"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion._id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {currentQuestionIndex === exam.questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold text-gray-800">Exam Results</h2>
              <p className="mt-4 text-green-600">Correct: {Object.keys(selectedAnswers).filter((key) => selectedAnswers[key] === exam.questions.find(q => q._id === key)?.correctAnswer).length}</p>
              <p className="text-red-600">Incorrect: {Object.keys(selectedAnswers).filter((key) => selectedAnswers[key] !== exam.questions.find(q => q._id === key)?.correctAnswer).length}</p>
              <p className="mt-4 font-bold text-gray-700">Marks Obtained: <span className="text-blue-600">{Object.keys(selectedAnswers).filter((key) => selectedAnswers[key] === exam.questions.find(q => q._id === key)?.correctAnswer).length * (exam.totalMarks / exam.questions.length)} / {exam.totalMarks}</span></p>

              {exam.type === "Certification Exam" && (
                certificateUrl ? (
                  <a href={certificateUrl} download className="mt-4 block text-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Download Certificate
                  </a>
                ) : (
                  <button onClick={handleGenerateCertificate} disabled={status === "loading"} className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    {status === "loading" ? "Generating..." : "Generate Certificate"}
                  </button>
                )
              )}

              <button onClick={() => navigate("/exams")} className="mt-4 w-full px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                Close
              </button>
            </div>
          </div>
        )}

        {timeUp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-bold text-red-600">Time's Up!</h2>
              <p className="mt-4 text-gray-600">The exam time has expired. Please submit your answers.</p>
              <button
                onClick={() => {
                  handleSubmitResult();
                  setShowResult(true);
                  setTimeUp(false);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Submit & View Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartExam;