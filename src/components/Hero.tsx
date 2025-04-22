
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full bg-[#f0f0e7] px-4 md:px-8">
      <img
        src="/lovable-uploads/29dba077-d6f4-45a6-a0b4-6039d326392b.png"
        alt="247art Logo"
        className="w-48 h-auto mx-auto mb-8 animate-float"
        style={{ 
          userSelect: "none",
          display: "block",
        }}
        draggable={false}
      />
      <img
        src="/lovable-uploads/15739276-28db-43e5-a9eb-b535e07a2903.png"
        alt="247art Gallery - EPIC 100-DAY EXHIBITION"
        className="w-full h-auto shadow-lg mx-auto max-w-4xl my-4"
        style={{ 
          userSelect: "none",
          display: "block",
          borderRadius: "8px"
        }}
        draggable={false}
      />
    </div>
  );
};

export default Hero;
