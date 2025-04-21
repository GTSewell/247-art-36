
import React from "react";

/**
 * NewPromoAfterFlipSection:
 * Displays an attached image, full width and height (natural, not cut off).
 */
const NewPromoAfterFlipSection = () => {
  return (
    <section className="relative w-full bg-transparent">
      <img
        src="/lovable-uploads/ad88dc71-d072-4b16-9572-a77add22c403.png"
        alt="Promo Full Height"
        className="w-full h-auto"
        style={{ display: "block", width: "100vw", maxWidth: "100%" }}
        draggable={false}
      />
    </section>
  );
};

export default NewPromoAfterFlipSection;
