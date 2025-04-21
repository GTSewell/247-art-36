
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full" style={{ backgroundColor: "#f0f0e7" }}>
      {/* Full-bleed top hero image (NO LOGO FLOATS) */}
      <img
        src="/lovable-uploads/61844a65-76b3-461e-a68c-9bccec8942c9.png"
        alt="247art-Gallery-Melbourne-EPIC 100-DAY EXHIBITION"
        className="w-full h-auto"
        style={{ 
          userSelect: "none", 
          aspectRatio: "1408/873", 
          display: "block",
          width: "100vw",
          maxWidth: "100%"
        }}
        draggable={false}
      />
    </div>
  );
};

export default Hero;
