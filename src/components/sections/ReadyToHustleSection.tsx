
import React from "react";

/**
 * ReadyToHustleSection: 
 * Displays the "READY TO HUSTLE" promo image, matching full width and aspect ratio.
 */
const ReadyToHustleSection = () => {
  // The image provided is 1421x768 (aspect ratio 1421/768 ≈ 1.851)
  return (
    <section className="relative w-full flex justify-center items-center bg-transparent">
      <div className="w-full max-w-7xl mx-auto">
        <img
          src="/lovable-uploads/e2a5c091-f205-438c-96b2-be72ef184ee2.png"
          alt="READY TO HUSTLE promo"
          className="w-full h-auto"
          style={{ aspectRatio: "1421/768", display: "block" }}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default ReadyToHustleSection;
