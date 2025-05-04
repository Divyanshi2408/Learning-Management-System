import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExams } from "../redux/examSlice";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiClipboard, FiDollarSign, FiBarChart, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminExamList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { exams, status, loading, error } = useSelector((state) => state.exam);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredExams, setFilteredExams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchExams()); // Fetch exams only if not already loaded
        }
    }, [dispatch, status]);

    useEffect(() => {
        dispatch(fetchExams());
    }, [dispatch]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter((exam) =>
                exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredExams(filtered);
        }
        setCurrentPage(1);
    }, [searchQuery, exams]);

    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white p-5">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin/usersList" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiUsers /> Manage Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/coursesList" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiBook /> Manage Courses
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/exams" className="flex items-center gap-2 p-2 bg-blue-700 rounded">
                                <FiClipboard /> Manage Exams
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/payments" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiDollarSign /> Payments
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/reports" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiBarChart /> Reports & Analytics
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/dash" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiHome /> Back to Admin Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">All Exams</h2>

                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search exams by title or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg shadow-md w-full max-w-md"
                    />
                </div>

                {loading && <p className="text-center text-gray-600">Loading exams...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && currentExams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentExams.map((exam) => (
                            <div key={exam._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {exam.title}
                                    </h3>
                                    <p className="text-gray-600">Code: {exam.code}</p>
                                    <p className="text-gray-600">Subject: {exam.subject}</p>
                                    <p className="text-gray-600">Category: {exam.category}</p>
                                    <p className="text-gray-600">
                                        Time Limit: {exam.timeLimit} min
                                    </p>
                                    <p className="text-gray-600">
                                        Number of Questions: {exam.numQuestions}
                                    </p>
                                    <p className="text-gray-600">Total Marks: {exam.totalMarks}</p>
                                    <p className="text-gray-700 font-semibold">
                                        Exam Type: {exam.type}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate(`/exam/start/${exam._id}`)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                                >
                                    Start Exam
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No exams found.</p>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-8 space-x-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminExamList;
