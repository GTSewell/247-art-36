
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * FlipTheOldSection:
 * Displays the new promo image, full width with maintained aspect ratio.
 */
const FlipTheOldSection = () => {
  // The provided image has dimensions 1408 x 590 (aspect ratio approx 1408/590 = 2.386)
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <AspectRatio ratio={1408 / 590}>
          <img
            src="/lovable-uploads/471ff355-4851-443f-9b39-ed2548122887.png"
            alt="OUT WITH THE OLD promo"
            className="w-full h-full object-cover"
            draggable={false}
            style={{ display: "block" }}
          />
        </AspectRatio>
      </div>
    </section>
  );
};

export default FlipTheOldSection;
