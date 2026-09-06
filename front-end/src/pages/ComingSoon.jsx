import React from "react";
import { Link } from "react-router-dom";

// Generic placeholder for admin sections that are planned but not
// built out yet (e.g. Payments, Reports & Analytics). Keeps sidebar
// links functional instead of hitting the 404 page.
const ComingSoon = ({ title = "Coming Soon", description }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
      <p className="text-gray-600 max-w-md mb-6">
        {description || "This section is under active development and will be available soon."}
      </p>
      <Link
        to="/admin/Dash"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Back to Admin Dashboard
      </Link>
    </div>
  );
};

export default ComingSoon;
