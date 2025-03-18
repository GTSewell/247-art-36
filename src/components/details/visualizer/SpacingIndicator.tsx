
import React from 'react';

interface SpacingIndicatorProps {
  scale: number;
  spacing: number;
}

const SpacingIndicator: React.FC<SpacingIndicatorProps> = ({ scale, spacing }) => {
  const scaledSpacing = spacing * scale;
  
  return (
    <>
      {/* Top spacing indicator */}
      <div 
        className="absolute border-t border-dashed border-gray-400"
        style={{ 
          top: `-${scaledSpacing}px`, 
          left: '0',
          right: '0',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
          +{spacing}cm
        </div>
      </div>
      
      {/* Bottom spacing indicator */}
      <div 
        className="absolute border-b border-dashed border-gray-400"
        style={{ 
          bottom: `-${scaledSpacing}px`, 
          left: '0',
          right: '0',
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
          +{spacing}cm
        </div>
      </div>
      
      {/* Left spacing indicator */}
      <div 
        className="absolute border-l border-dashed border-gray-400"
        style={{ 
          left: `-${scaledSpacing}px`, 
          top: '0',
          bottom: '0',
        }}
      >
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
          +{spacing}cm
        </div>
      </div>
      
      {/* Right spacing indicator */}
      <div 
        className="absolute border-r border-dashed border-gray-400"
        style={{ 
          right: `-${scaledSpacing}px`, 
          top: '0',
          bottom: '0',
        }}
      >
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white px-1 text-[10px] text-gray-500">
          +{spacing}cm
        </div>
      </div>
    </>
  );
};

export default SpacingIndicator;
