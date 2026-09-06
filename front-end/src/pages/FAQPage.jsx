import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Browse the Courses page, open the course you're interested in, and click Enroll. You'll need to be logged in first — use the Sign Up button in the navbar if you don't have an account yet.",
  },
  {
    question: "How do exams and certificates work?",
    answer:
      "Once you're enrolled in a course, any exams linked to it appear under the Exams tab. After you submit an exam, your result is graded automatically and a certificate becomes available from your profile if you pass.",
  },
  {
    question: "Can I become a trainer and publish my own courses?",
    answer:
      "Yes. Sign up with the trainer role, then use the trainer dashboard to create and manage courses, lessons, and exams for your students.",
  },
  {
    question: "I forgot my password. What do I do?",
    answer:
      "Currently password resets are handled from your Profile page while logged in. If you're locked out, reach out via the Contact page and we'll help you regain access.",
  },
  {
    question: "Is DevDojo free to use?",
    answer:
      "Course pricing is set individually by each trainer. Some courses are free, others are paid — you'll always see the price clearly on the course page before enrolling.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-4 text-gray-800"
        variants={itemVariants}
      >
        Frequently Asked Questions
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 text-center mb-12"
        variants={itemVariants}
      >
        Answers to the questions we hear most from learners and trainers.
      </motion.p>

      <motion.div className="space-y-4" variants={itemVariants}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`text-blue-600 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 pb-4 text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default FAQPage;
