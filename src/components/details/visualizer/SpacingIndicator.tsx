
import React from 'react';

interface SpacingIndicatorProps {
  scale: number;
  spacing: number;
}

const SpacingIndicator: React.FC<SpacingIndicatorProps> = ({ scale, spacing }) => {
  return (
    <div 
      className="absolute border border-dashed border-gray-400"
      style={{ 
        top: `-${spacing * scale}px`, 
        left: `-${spacing * scale}px`,
        right: `-${spacing * scale}px`,
        bottom: `-${spacing * scale}px`,
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
        +{spacing}cm
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
        +{spacing}cm
      </div>
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
        +{spacing}cm
      </div>
      <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
        +{spacing}cm
      </div>
    </div>
  );
};

export default SpacingIndicator;
