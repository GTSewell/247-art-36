
import React from "react";

/**
 * ReadyToHustleSection: 
 * Displays the "READY TO HUSTLE" promo image, matching full width and aspect ratio.
 */
const ReadyToHustleSection = () => {
  return (
    <section className="relative w-full bg-transparent">
      <img
        src="/lovable-uploads/e2a5c091-f205-438c-96b2-be72ef184ee2.png"
        alt="READY TO HUSTLE promo"
        className="w-full h-auto"
        style={{ display: "block", width: "100vw", maxWidth: "100%" }}
        draggable={false}
      />
    </section>
  );
};

export default ReadyToHustleSection;
