import React, { useEffect, useState } from "react";

const MousePointer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed w-4 h-4 bg-blue-400 rounded-full pointer-events-none transition-transform duration-300 ease-out z-50"
      style={{
        transform: `translate(${position.x-8}px, ${position.y-55}px)`,
      }}
    />
  );
};

export default MousePointer;
