
import React from "react";

/**
 * NewPromoAfterFlipSection:
 * Displays an attached image, full width and height (natural, not cut off).
 */
const NewPromoAfterFlipSection = () => {
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/ad88dc71-d072-4b16-9572-a77add22c403.png"
          alt="Promo Full Height"
          className="w-full h-auto block"
          draggable={false}
          style={{ maxHeight: "none", width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </section>
  );
};

export default NewPromoAfterFlipSection;
