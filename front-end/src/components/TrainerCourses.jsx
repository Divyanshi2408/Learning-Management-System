import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrainerCourses } from "../redux/courseSlice";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";

const TrainerCourses = () => {
  const dispatch = useDispatch();
  const { trainerCourses, loading, error } = useSelector((state) => state.courses);
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role === "trainer") {
      dispatch(fetchTrainerCourses());
    }
  }, [dispatch, currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-10">
      <button onClick={() => navigate(-1)} className="mb-2 mx-6 px-4 py-1 bg-black text-white hover:bg-gray-900">
        ← Back
      </button>
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Created Courses</h2>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center text-gray-600">Loading your courses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {trainerCourses.length === 0 && !loading && !error && (
          <p className="text-center text-gray-600">No courses found.</p>
        )}

        {/* Courses Grid */}
        {!loading && !error && trainerCourses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerCourses.map((course) => (
              <CourseCard
                key={course._id}
                image={course.thumbnail}
                category={course.category}
                heading={course.title}
                level={course.level || "Beginner"}
                duration={course.duration || "N/A"}
                link={`/TrainerCourseDetails/${course._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerCourses;
