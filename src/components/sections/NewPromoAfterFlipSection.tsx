
import React from "react";

/**
 * NewPromoAfterFlipSection:
 * Displays the next promo image, full width and responsive.
 * Provided image dimensions: 1421 x 768 (aspect ratio 1.851)
 */
const NewPromoAfterFlipSection = () => {
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/c029fd54-af68-4a28-a4cb-34c7b6bf8c11.png"
          alt="Promo section image (exhibit your art after OUT WITH THE OLD)"
          className="w-full h-auto"
          style={{ aspectRatio: "1421/768", display: "block" }}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default NewPromoAfterFlipSection;

