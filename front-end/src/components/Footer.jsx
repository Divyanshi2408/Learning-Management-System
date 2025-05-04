import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import devdojo from "../assets/DevDojo.png";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="logo">
            <img className="w-40" src={devdojo} alt="Logo" />
          </Link>
          <p className="text-sm mt-3 text-gray-400 text-center md:text-left">
            Empowering learners with quality education anytime, anywhere.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/courses" className="hover:text-blue-400 transition duration-300">
                📚 Courses
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-blue-400 transition duration-300">
                ℹ️ About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition duration-300">
                ✉️ Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-blue-400 transition duration-300">
                ❓ FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg text-white">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4 mt-3">
            <a href="#" className="hover:text-blue-500 transition duration-300">
              <FaFacebook size={28} />
            </a>
            <a href="#" className="hover:text-sky-400 transition duration-300">
              <FaTwitter size={28} />
            </a>
            <a href="#" className="hover:text-pink-500 transition duration-300">
              <FaInstagram size={28} />
            </a>
            <a href="#" className="hover:text-blue-600 transition duration-300">
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} <span className="text-blue-400 font-semibold">DevDojo</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
