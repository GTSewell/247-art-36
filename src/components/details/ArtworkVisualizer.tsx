
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Artwork {
  id: number;
  width: number;
  height: number;
  fits: boolean;
  area: number;
}

interface ArtworkVisualizerProps {
  artworks: Artwork[];
  maxArea: number;
  totalArea: number;
  spacing: number;
}

const ArtworkVisualizer: React.FC<ArtworkVisualizerProps> = ({ 
  artworks, 
  maxArea, 
  totalArea,
  spacing 
}) => {
  // Calculate how much of the available space is used (as a percentage)
  const usedPercentage = Math.min(100, (totalArea / maxArea) * 100);
  
  // Determine if artworks exceed the max area
  const exceededSpace = totalArea > maxArea;

  // Calculate a reasonable scale for visualization
  // Find the largest artwork dimension to use as a reference
  const maxDimension = artworks.reduce((max, artwork) => {
    return Math.max(max, artwork.width, artwork.height);
  }, 0);

  // Set a maximum visualization width
  const visualizationWidth = 400;
  
  // Scale factor based on the largest dimension
  const scale = visualizationWidth / (maxDimension * 2);

  return (
    <div className="space-y-4">
      {/* Space usage indicator */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className={`h-4 rounded-full ${exceededSpace ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${usedPercentage}%` }}
        />
        <div className="text-xs mt-1 text-right">
          {totalArea} / {maxArea} sq cm ({usedPercentage.toFixed(1)}%)
        </div>
      </div>

      {/* Artworks visualization */}
      <div className="w-full border border-gray-300 rounded-lg p-4 flex flex-wrap gap-4 justify-center bg-gray-50">
        {artworks.map((artwork, index) => {
          // Calculate the visual width and height for this element
          const visualWidth = artwork.width * scale;
          const visualHeight = artwork.height * scale;
          
          // Calculate the aspect ratio for the container
          const aspectRatio = artwork.width / artwork.height;
          
          return (
            <div key={artwork.id} className="text-center">
              <div className="mb-2 text-sm font-medium">Artwork {index + 1}</div>
              <div 
                className={`relative border-2 ${artwork.fits ? 'border-green-500' : 'border-red-500'}`}
                style={{ 
                  width: `${visualWidth}px`, 
                  height: `${visualHeight}px`,
                  minWidth: '60px',
                  minHeight: '60px'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-xs">
                  {artwork.width} × {artwork.height} cm
                </div>
                
                {/* Show spacing visualization if there are multiple artworks */}
                {artworks.length > 1 && (
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
                )}
              </div>
              <div className="mt-1 text-xs">
                {artwork.width * artwork.height} sq cm
                {artworks.length > 1 && (
                  <div className="text-gray-500">
                    With spacing: {artwork.area} sq cm
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Information about spacing */}
      {artworks.length > 1 && (
        <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg">
          <strong>Note:</strong> When displaying multiple artworks, we add {spacing}cm spacing on all sides of each artwork.
          This increases the total space needed.
        </div>
      )}
    </div>
  );
};

export default ArtworkVisualizer;
