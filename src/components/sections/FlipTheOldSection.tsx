
import React from "react";

/**
 * FlipTheOldSection:
 * Displays the new promo image, full width with maintained aspect ratio.
 */
const FlipTheOldSection = () => {
  return (
    <section className="relative w-full bg-transparent">
      <img
        src="/lovable-uploads/471ff355-4851-443f-9b39-ed2548122887.png"
        alt="OUT WITH THE OLD promo"
        className="w-full h-auto"
        style={{ display: "block", width: "100vw", maxWidth: "100%" }}
        draggable={false}
      />
    </section>
  );
};

export default FlipTheOldSection;
