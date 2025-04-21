
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full bg-[#f0f0e7] px-4 md:px-8">
      <img
        src="/lovable-uploads/15739276-28db-43e5-a9eb-b535e07a2903.png"
        alt="247art Gallery - EPIC 100-DAY EXHIBITION"
        className="w-full h-auto shadow-lg mx-auto max-w-4xl my-4"
        style={{ 
          userSelect: "none",
          display: "block",
          borderRadius: "8px" // Using a smaller border radius that won't cut off content
        }}
        draggable={false}
      />
    </div>
  );
};

export default Hero;
