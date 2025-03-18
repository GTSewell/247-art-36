
import React from 'react';

interface SpaceUsageIndicatorProps {
  totalArea: number;
  maxArea: number;
}

const SpaceUsageIndicator: React.FC<SpaceUsageIndicatorProps> = ({ totalArea, maxArea }) => {
  // Calculate how much of the available space is used (as a percentage)
  const usedPercentage = Math.min(100, (totalArea / maxArea) * 100);
  
  // Determine if artworks exceed the max area
  const exceededSpace = totalArea > maxArea;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div 
        className={`h-4 rounded-full ${exceededSpace ? 'bg-red-500' : 'bg-green-500'}`}
        style={{ width: `${usedPercentage}%` }}
      />
      <div className="text-xs mt-1 text-right">
        {totalArea} / {maxArea} sq cm ({usedPercentage.toFixed(1)}%)
      </div>
    </div>
  );
};

export default SpaceUsageIndicator;
