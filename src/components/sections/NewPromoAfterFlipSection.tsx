
import React from "react";

const NewPromoAfterFlipSection = () => {
  return (
    <div className="relative w-full">
      {/* Full width bottom image */}
      <img
        src="/lovable-uploads/0d1d9757-2d61-4242-9d9c-b28d760acdc1.png"
        alt="247art Gallery Promotion"
        className="w-full h-auto object-cover"
        style={{
          userSelect: "none",
          display: "block",
          width: "100vw",
          maxWidth: "100%"
        }}
        draggable={false}
      />
    </div>
  );
};

export default NewPromoAfterFlipSection;
