
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * NewPromoAfterFlipSection:
 * Displays the "BUILT BY ARTISTS FOR ARTISTS" promo, matching full width and aspect ratio.
 */
const NewPromoAfterFlipSection = () => {
  // The final section image is 1408 x 204 (ratio ≈ 6.9, but adjust to your image)
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <AspectRatio ratio={1408 / 204}>
          <img
            src="/lovable-uploads/a8887bab-eee8-40cc-b5c6-82b45df86a67.png"
            alt="BUILT BY ARTISTS FOR ARTISTS promo"
            className="w-full h-full object-cover"
            draggable={false}
            style={{ display: "block" }}
          />
        </AspectRatio>
      </div>
    </section>
  );
};
export default NewPromoAfterFlipSection;
