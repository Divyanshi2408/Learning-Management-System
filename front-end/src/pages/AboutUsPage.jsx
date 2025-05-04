import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutUsPage = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title Section */}
      <motion.h1
        className="text-4xl font-bold text-center mb-6 text-gray-800"
        variants={itemVariants}
      >
        About Us
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 text-center mb-12"
        variants={itemVariants}
      >
        Empowering learners to achieve their goals through innovative education.
      </motion.p>

      {/* Mission Section */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          At LMS, our mission is to provide a seamless and engaging learning experience for students, educators, and professionals. We aim to make education accessible, interactive, and effective for everyone.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Learn More
        </button>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <motion.div
            className="text-center group"
            variants={itemVariants}
          >
            <img
              src="/images/team-member1.jpg"
              alt="John Doe"
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              John Doe
            </h3>
            <p className="text-gray-600 group-hover:text-blue-500 transition-colors duration-300">
              Co-Founder & CEO
            </p>
          </motion.div>

          {/* Team Member 2 */}
          <motion.div
            className="text-center group"
            variants={itemVariants}
          >
            <img
              src="/images/team-member2.jpg"
              alt="Jane Smith"
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Jane Smith
            </h3>
            <p className="text-gray-600 group-hover:text-blue-500 transition-colors duration-300">
              Lead Developer
            </p>
          </motion.div>

          {/* Team Member 3 */}
          <motion.div
            className="text-center group"
            variants={itemVariants}
          >
            <img
              src="/images/team-member3.jpg"
              alt="Alice Johnson"
              className="w-48 h-48 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Alice Johnson
            </h3>
            <p className="text-gray-600 group-hover:text-blue-500 transition-colors duration-300">
              UX/UI Designer
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed">
          <li>Innovation: We constantly strive to improve and innovate our platform.</li>
          <li>Accessibility: Education should be available to everyone, everywhere.</li>
          <li>Collaboration: We believe in teamwork and shared success.</li>
          <li>Quality: We are committed to delivering high-quality learning experiences.</li>
        </ul>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="text-center border-t border-gray-200 pt-8 mt-12"
        variants={itemVariants}
      >
        <p className="text-gray-600">© 2023 LMS. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
};

export default AboutUsPage;