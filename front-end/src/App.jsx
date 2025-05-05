import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";
import DevDojoLogo from "./assets/DevDojoLogo.png"; // Ensure correct path
import EditExam from "./pages/EditExam.jsx";
import AdminExamList from "./pages/AdminExamList.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Lazy Loading Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const CourseDetails = lazy(() => import("./pages/CourseDetails.jsx"));
const TrainerCourseDetails = lazy(() => import("./pages/TrainerCourseDetails.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const CourseForm = lazy(() => import("./pages/CourseForm.jsx"));
const CoursesList = lazy(() => import("./pages/Courses.jsx"));
const UpdateUserDetails = lazy(() => import("./components/UpdateUserDetails.jsx"));
const CreateExam = lazy(() => import("./pages/CreateExam.jsx"));
const ExamList = lazy(() => import("./pages/ExamList.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage.jsx"));
const StartExam = lazy(() => import("./pages/StartExam.jsx"));
const UsersList = lazy(() => import("./components/UsersList.jsx"));
const UserDetails = lazy(() => import("./components/UserDetails.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AllCourses = lazy(() => import("./components/AllCourses.jsx"));
const TrainerExams = lazy(() => import("./components/TrainerExams.jsx"));
const TrainerCourses = lazy(() => import("./components/TrainerCourses.jsx"));

// Full-Page Loading Screen
const LoadingScreen = () => (
  <div className="loading-container">
    <img src={DevDojoLogo} alt="Loading..." className="loading-logo" />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-second loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  if (isLoading) {
    return <LoadingScreen />; // Show only the loading screen
  }

  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="pt-12 bg-gray-200"> 
      <Suspense fallback={<LoadingScreen />}>
        
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CourseDetails/:id" element={<CourseDetails />} />
          <Route path="/TrainerCourseDetails/:id" element={<TrainerCourseDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/courseForm" element={<CourseForm />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/updateUser" element={<UpdateUserDetails />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/exam/start/:examId" element={<StartExam />} />
          <Route path="/admin/usersList" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/admin/Dash" element={<AdminDashboard />} />
          <Route path="/admin/coursesList" element={<AllCourses />} />
          <Route path="/trainer-exams" element={<TrainerExams />} />
          <Route path="/trainer-courses" element={<TrainerCourses />} /> 
          <Route path="/exams/edit/:examId" element={<EditExam />} /> 
          <Route path="/admin/exams" element={<AdminExamList />} /> 
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      
      </Suspense>
      <Footer />
      </div>

    </Router>
  );
}

export default App;
