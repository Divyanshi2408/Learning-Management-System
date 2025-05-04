import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      console.log(response.data);

      // Show success message
      setMessage({ text: 'Message sent successfully!', type: 'success' });

      // Clear the form
      setFormData({ name: '', email: '', message: '' });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);

      // Show error message
      setMessage({ text: 'Failed to send message. Please try again.', type: 'error' });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

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
        Contact Us
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 text-center mb-12"
        variants={itemVariants}
      >
        We'd love to hear from you! Reach out to us for any questions or feedback.
      </motion.p>

      {/* Success/Error Message */}
      {message.text && (
        <motion.div
          className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          variants={itemVariants}
        >
          {message.text}
        </motion.div>
      )}

      {/* Contact Form */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </motion.section>

      {/* Contact Information */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-600">123 Learning Street</p>
            <p className="text-gray-600">Education City, EC 4567</p>
          </div>

          {/* Phone */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-600">+1 (123) 456-7890</p>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600">info@lms.com</p>
          </div>
        </div>
      </motion.section>

      {/* Map */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Location</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d144.9537353153166!3d-37.81627974202167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2aabc5e4f1e!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1622549402999!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
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

export default ContactPage;