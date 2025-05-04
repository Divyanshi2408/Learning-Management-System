import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourses } from "../redux/courseSlice";
import { FaCheckCircle, FaPlay } from "react-icons/fa";
import herobg from "../assets/herobg.jpg";
import fetchbg from "../assets/example.jpg";
import reviewbg from "../assets/reviewbg.png";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import html5 from "../assets/html5.svg";
import css3 from "../assets/css3.svg";
import javascript from "../assets/js.svg";
import nodejs from "../assets/node-js.svg";
import python from "../assets/python.svg";
import react from "../assets/react.svg";
import vue from "../assets/vuejs.svg";
import angular from "../assets/angular.svg";
import CourseCategories from "../components/CourseCategories";
import Testimonial from "../components/Testimonial";
import MousePointer from "../components/MousePointer";
import { motion } from "framer-motion";
import ScrollToTopButton from "../components/ScrollToTopButton";


const Home = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [additionalCourses, setAdditionalCourses] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses.length > 0) {
      let index = 1;
      setFeaturedCourse(courses[index]);
      setAdditionalCourses(courses.slice(1, 7));
      const interval = setInterval(() => {
        index = (index + 1) % courses.length;
        setFeaturedCourse(courses[index]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [courses]);

  const icons = [
    { src: html5, alt: "HTML5" },
    { src: css3, alt: "CSS3" },
    { src: javascript, alt: "JavaScript", bg: true },
    { src: nodejs, alt: "Node.js" },
    { src: python, alt: "Python" },
    { src: react, alt: "React" },
    { src: vue, alt: "Vue.js" },
    { src: angular, alt: "Angular" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Emma Hart",
      text: "Massa amet, at dolor tellus pellentesque aenean in eget massa tincidunt habitasse volutpat adipiscing sed id sit auctor eu vivamus nulla.",
      image: "/images/emma.jpg",
    },
    {
      id: 2,
      name: "Eddie Johnson",
      text: "Ut morbi felis, felis massa quam sit massa, amet, bibendum pulvinar elit in adipiscing amet imperdiet ac felis congue enim, elementum orci.",
      image: "/images/eddie.jpg",
    },
    {
      id: 3,
      name: "Jonathan Doe",
      text: "Donec in varius facilisis justo, curabitur aliquet sit justo sed sit interdum diam dolor ornare quis a felis adipiscing hendrerit quisque enim.",
      image: "/images/jonathan.jpg",
    },
    {
      id: 4,
      name: "Mike Edward",
      text: "Pulvinar dui vitae enim, diam et nulla elit nam leo lacinia et, a, pulvinar gravida enim in blandit mauris vitae volutpat urna, sed justo hendrerit.",
      image: "/images/mike.jpg",
    },
  ];

  return (
    <div className="font-sans bg-gray-200">
      <MousePointer />
      {/* Hero Section with Slider */}
      <section
  className="relative h-auto md:h-[600px] bg-cover bg-center text-white"
  style={{ backgroundImage: `url(${herobg})` }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/80 backdrop-blur-sm"></div>

  <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 px-4 sm:px-6 md:px-10 py-12 md:h-full">
    <motion.div
      className="w-full md:w-1/2 text-center md:text-left"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-yellow-300 text-xs sm:text-sm uppercase tracking-widest">
        ● Featured Course
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 md:mt-3 drop-shadow-md leading-snug">
        {featuredCourse ? featuredCourse.title : "Loading..."}
      </h1>
      <p className="mt-3 text-sm sm:text-base text-gray-200">
        {featuredCourse ? featuredCourse.description : "Please wait..."}
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        {featuredCourse && (
          <Link
            to={`/CourseDetails/${featuredCourse._id}`}
            className="bg-white text-blue-700 px-5 py-2 font-bold shadow hover:scale-105 transition text-sm sm:text-base"
          >
            Start Course
          </Link>
        )}
        <Link
          to="/courses"
          className="border border-white px-5 py-2 font-semibold hover:bg-white hover:text-blue-700 transition text-sm sm:text-base"
        >
          View All →
        </Link>
      </div>
    </motion.div>

    <motion.div
      className="w-full md:w-1/2"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <img
        src={featuredCourse ? featuredCourse.thumbnail : "Loading..."}
        alt="Course"
        className="rounded-xl shadow-lg w-full max-h-[250px] sm:max-h-[320px] object-cover"
      />
    </motion.div>
  </div>
</section>


      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-6 justify-items-center">
          {icons.map((icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="hover:scale-110 transition-transform"
              title={icon.alt}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-12 md:w-14 opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition"
              />
            </motion.div>
          ))}
        </div>
      </section>



      {/* Additional Courses */}
      <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Explore More Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {additionalCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <CourseCard
                image={course.thumbnail}
                category={course.category}
                heading={course.title}
                level={course.level}
                duration={course.duration}
                link={`/CourseDetails/${course._id}`}
              />
            </motion.div>
          ))}
        </div>
      </section>


      <Testimonial />
      <ScrollToTopButton />  {/* 👈 Scroll to top button */}

    </div>
  );
};

export default Home;
