import React, { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookies.getItem("token"); // Check if user is logged in

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
