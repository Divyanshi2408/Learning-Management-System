import React, { useState, useEffect } from "react";

const images = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/30294328/pexels-photo-30294328/free-photo-of-modern-cafe-interior-with-warm-aesthetic.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start from the first real image
  const [isTransitioning, setIsTransitioning] = useState(true);

  const totalSlides = images.length;

  // Create a loop by adding first and last images as clones
  const slides = [
    images[totalSlides - 1], // Clone last image at the beginning
    ...images,
    images[0], // Clone first image at the end
  ];

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Handle infinite loop effect
  useEffect(() => {
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalSlides);
      }, 500);
    }
    if (currentIndex === totalSlides + 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 500);
    }
  }, [currentIndex, totalSlides]);

  return (
    <div className="w-fit h-100 my-2">

      <div className="overflow-hidden rounded-lg shadow-lg">
        <div
          className={`flex transition-transform ${
            isTransitioning ? "duration-500" : "duration-0"
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-100 flex-shrink-0 object-cover object-center"
            />
          ))}
        </div>
      </div>



<div className="relative -top-1/2  w-full flex justify-between px-4 transform">
  <button
    onClick={prevSlide}
    className="bg-black/50 text-white p-2 rounded-full"
  >
    ❮
  </button>
  <button
    onClick={nextSlide}
    className="bg-black/50 text-white p-2 rounded-full"
  >
    ❯
  </button>
</div>

    </div>
  );
};

export default Carousel;
