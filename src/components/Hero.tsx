
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full" style={{ backgroundColor: "#f0f0e7" }}>
      <img
        src="/lovable-uploads/15739276-28db-43e5-a9eb-b535e07a2903.png"
        alt="247art Gallery - EPIC 100-DAY EXHIBITION"
        className="w-full h-auto shadow-lg rounded-2xl mx-auto max-w-4xl my-8 mt-[100px]"
        style={{ 
          userSelect: "none",
          display: "block"
        }}
        draggable={false}
      />
    </div>
  );
};

export default Hero;
