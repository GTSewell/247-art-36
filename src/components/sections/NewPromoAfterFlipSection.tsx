
import React from "react";

/**
 * NewPromoAfterFlipSection:
 * Displays the next promo image, full width and responsive.
 * Uses object-cover for unsquished, full coverage in all viewports.
 * Replace aspect-w/h as per actual image dimensions.
 */
const NewPromoAfterFlipSection = () => {
  // Suppose the new image's dimensions are 1700x700; adjust if needed
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <div className="relative w-full aspect-[1700/700]">
          <img
            src="/lovable-uploads/91d913c0-84aa-4722-a729-eddcbe1386cb.png"
            alt="Promo section image (exhibit your art after OUT WITH THE OLD)"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

export default NewPromoAfterFlipSection;
