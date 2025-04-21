
import React from "react";

/**
 * FlipTheOldSection:
 * Displays the new promo image, full width with maintained aspect ratio.
 */
const FlipTheOldSection = () => {
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/471ff355-4851-443f-9b39-ed2548122887.png"
          alt="OUT WITH THE OLD promo"
          className="w-full h-auto"
          draggable={false}
          style={{ display: "block" }}
        />
      </div>
    </section>
  );
};

export default FlipTheOldSection;
