
import React from "react";

const FlipTheOldSection = () => {
  return (
    <section className="relative w-full bg-[#f0f0e7] px-4 md:px-8">
      <img
        src="/lovable-uploads/7e00144a-12b3-43ed-bf4e-f299a88a1852.png"
        alt="OUT WITH THE OLD promo"
        className="w-full h-auto shadow-lg mx-auto max-w-4xl my-4"
        style={{ 
          display: "block",
          borderRadius: "8px"
        }}
        draggable={false}
      />
    </section>
  );
};

export default FlipTheOldSection;
