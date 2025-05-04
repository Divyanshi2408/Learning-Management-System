import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const testimonialsData = [
  {
    id: 1,
    name: "John Doe",
    role: "Full Stack Developer",
    testimonial:
      "Brook's mentorship helped me level up my coding skills. The project-based learning approach is fantastic!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPnE_fy9lLMRP5DLYLnGN0LRLzZOiEpMrU4g&s",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Frontend Engineer",
    testimonial:
      "The React component series gave me the confidence to build complex UIs with ease. Highly recommended!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAF9_aVW_JaNa6KU2-f0USKAhL1lPhuVxcng&s",
  },
  {
    id: 3,
    name: "Alice Johnson",
    role: "Backend Developer",
    testimonial:
      "Learning Node.js and Express was a breeze thanks to Brook's practical explanations.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0krX0e-PY9YM7zNJ7i5iPPZxYHhg7NJ3yuA&s",
  },
  {
    id: 4,
    name: "Bob Williams",
    role: "UI/UX Designer",
    testimonial:
      "I improved my design-to-code skills drastically by following the Tailwind CSS tutorials.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSC4YpV2Wsenk9MEeoauZ1RLX_AFbdS1EhSg&s",
  },
  {
    id: 5,
    name: "Eve Adams",
    role: "DevOps Engineer",
    testimonial:
      "The Next.js tips were incredibly useful. I implemented them in my real-world project.",
    image:
      "https://watermark.lovepik.com/photo/20220316/large/lovepik-professional-business-woman-elite-image-picture_502367423.jpg",
  },
  {
    id: 6,
    name: "Charlie Brown",
    role: "Tech Lead",
    testimonial:
      "Brook's guidance helped me lead my team with confidence. His practical insights are invaluable.",
    image:
      "https://images.squarespace-cdn.com/content/v1/5521b031e4b06ebe90178744/1560360135937-3YXVZ3124L1YL2FOASSQ/headshots-linkedin-photographer.jpg",
  },
];

const Testimonial = () => {
  const [randomTestimonials, setRandomTestimonials] = useState([]);

  useEffect(() => {
    const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
    setRandomTestimonials(shuffled.slice(0, 3));
  }, []);

  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Trusted by Thousands of Learners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {randomTestimonials.map((item, i) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <svg
                  className="w-6 h-6 text-blue-500 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 975.036 975.036"
                >
                  <path d="M7.17 6A5.001 5.001 0 0 0 2 11c0 1.66.81 3.13 2.06 4.06A5.985 5.985 0 0 0 5 17v1a1 1 0 0 0 2 0v-1c0-1.26.31-2.45.85-3.5A5.001 5.001 0 0 0 12 6H7.17zm9 0A5.001 5.001 0 0 0 11 11c0 1.66.81 3.13 2.06 4.06A5.985 5.985 0 0 0 14 17v1a1 1 0 0 0 2 0v-1c0-1.26.31-2.45.85-3.5A5.001 5.001 0 0 0 21 6h-4.83z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{item.testimonial}</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-gray-900 font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
