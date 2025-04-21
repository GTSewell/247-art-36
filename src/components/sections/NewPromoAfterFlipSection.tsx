
import React from "react";

/**
 * NewPromoAfterFlipSection:
 * Displays the next promo image, full width and responsive.
 * Provided image dimensions: 1424 x 714 (aspect ratio approx 2.0)
 */
const NewPromoAfterFlipSection = () => {
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/8983a135-6c5e-46b3-9e72-a95c612d15ce.png"
          alt="Updated Promo section image (exhibit your art after OUT WITH THE OLD)"
          className="w-full h-auto"
          style={{ aspectRatio: "1424/714", display: "block" }}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default NewPromoAfterFlipSection;

