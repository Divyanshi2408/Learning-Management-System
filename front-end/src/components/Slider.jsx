import React from "react";
import "../App.css";

const Card = () => {
  const cards = [
    {
      text1: "HELLO THERE",
      text2: "Am Ashwin.A",
      bg: "bg-gradient-to-r from-orange-400 to-pink-400",
    },
    {
      text1: "Do follow on Insta",
      text2: "ashwin_ambar_",
      bg: "bg-gradient-to-r from-purple-600 to-blue-500",
    },
    {
      text1: "Replace cards with images",
      text2: "for an image slider",
      bg: "bg-gradient-to-r from-cyan-400 to-blue-500",
    },
    {
      text1: "Html css only",
      text2: "Hover to stop the slides",
      bg: "bg-gradient-to-r from-red-500 to-pink-700",
    },
    {
      text1: "Card 5",
      text2: "Content for card 5",
      bg: "bg-gradient-to-r from-pink-300 to-pink-500",
    },
    {
      text1: "Card 6",
      text2: "Content for card 6",
      bg: "bg-gradient-to-r from-red-300 to-orange-300",
    },
    {
      text1: "Card 7",
      text2: "Modify it and use",
      bg: "bg-gradient-to-r from-blue-300 to-blue-200",
    },
    {
      text1: "Card 8",
      text2: "Content for card 8",
      bg: "bg-gradient-to-r from-pink-300 to-purple-400",
    },
    {
      text1: "Card 9",
      text2: "Content for card 9",
      bg: "bg-gradient-to-r from-green-300 to-blue-300",
    },
  ];

  return (
    <div className="w-full overflow-hidden relative">
      {/* Scrolling Container */}
      <div className="flex w-max animate-marquee group-hover">
        {[...cards, ...cards].map((card, index) => (
          <div
            key={index}
            className={`h-48 min-w-[250px] mx-2 p-4 rounded-lg shadow-lg text-white text-center flex flex-col justify-center ${card.bg}`}
          >
            <p className="text-lg font-bold">{card.text1}</p>
            <p className="text-sm">{card.text2}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
