import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import devdojo from "../assets/DevDojo.png";
import { fetchCurrentUser } from "../redux/userSlice";
import userImage from "/user.png";
import { toast } from "react-toastify";
import useNetworkStatus from "../hooks/useNetworkStatus";


function Navbar() {
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.users);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) dispatch(fetchCurrentUser());
  }, [dispatch, user]);

  const openLogin = () => setModalType("login");
  const openRegister = () => setModalType("register");
  const closeModal = () => setModalType(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch({ type: "user/resetCurrentUser" });
    navigate("/");
    setDropdownOpen(false);
    setMenuOpen(false);
    toast.success("Logged Out Successfully!");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/courses?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };
  const isOnline = useNetworkStatus();
  const wasOnline = useRef(isOnline);

  useEffect(() => {
    if (wasOnline.current !== isOnline) {
      if (!isOnline) {
        toast.error("You're offline. Some features may not work.");
      } else {
        toast.success("You're back online!");
      }
      wasOnline.current = isOnline;
    }
  }, [isOnline]);


  return (
    <>
      <header className="w-full fixed z-50 bg-white shadow-md">
        <div className="flex justify-between items-center px-6 md:px-10 py-3 text-gray-800">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img className="w-28" src={devdojo} alt="Logo" />
          </Link>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/courses" className="hover:text-blue-600 transition-all font-medium">Courses</Link>

            {user && (
              <Link to="/exams" className="hover:text-blue-600 transition-all font-medium">Exams</Link>
            )}

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="px-3 py-2 w-80 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            {/* Auth/Dropdown */}
            {user && currentUser ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-blue-600 px-3 py-2 text-white rounded-md hover:bg-blue-500 transition"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={currentUser.profilePicture || userImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {currentUser.username}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-md overflow-hidden z-50 animate-fadeIn">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={openLogin}
                >
                  Login
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={openRegister}
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center py-4 gap-4 bg-white shadow-lg z-40">
            <Link to="/courses" className="text-lg font-medium hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              Courses
            </Link>

            {user && (
              <Link to="/exams" className="text-lg font-medium hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                Exams
              </Link>
            )}

            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="px-4 py-2 w-4/5 border rounded-md focus:ring-2 focus:ring-blue-500"
            />

            {user ? (
              <>
                <Link to="/profile" className="text-lg font-medium hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button className="text-red-500 font-medium hover:text-red-700" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={openLogin}
                >
                  Login
                </button>
                <button
                  className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={openRegister}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
        {!isOnline && (
          <div className="bg-red-600 text-white text-center text-sm py-1 animate-pulse">
            ⚠️ You are currently offline
          </div>
        )}

      </header>

      {/* Login & Register Modals */}
      {modalType === "login" && <Login isOpen={true} onClose={closeModal} onRegisterClick={openRegister} />}
      {modalType === "register" && <Register isOpen={true} onClose={closeModal} onLoginClick={openLogin} />}
    </>
  );
}

export default Navbar;
