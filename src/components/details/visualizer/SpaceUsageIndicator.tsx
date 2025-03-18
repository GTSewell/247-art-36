
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
  
  // Check if the artwork is within 5% over the limit
  const slightlyOver = totalArea > maxArea && totalArea <= maxArea * 1.05;

  // Determine the color based on the conditions
  let barColor = 'bg-green-500';
  if (exceededSpace) {
    barColor = slightlyOver ? 'bg-orange-500' : 'bg-red-500';
  }

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className={`h-4 rounded-full ${barColor}`}
          style={{ width: `${usedPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <div>
          {slightlyOver && (
            <span className="text-orange-600 font-medium">
              Ooh, just over. But. We'll let this one slide!
            </span>
          )}
        </div>
        <div className="text-right">
          {totalArea} / {maxArea} sq cm ({usedPercentage.toFixed(1)}%)
        </div>
      </div>
    </div>
  );
};

export default SpaceUsageIndicator;
