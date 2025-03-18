
import React from 'react';
import { Artwork } from "../types/artwork-types";
import ArtworkElement from './ArtworkElement';

interface ArtworksContainerProps {
  artworks: Artwork[];
  scale: number;
  spacing: number;
  totalArea: number;
  maxArea: number;
}

const ArtworksContainer: React.FC<ArtworksContainerProps> = ({ 
  artworks, 
  scale, 
  spacing,
  totalArea,
  maxArea
}) => {
  const bufferPercentage = 5; // 5% buffer
  const bufferThreshold = maxArea * (1 - bufferPercentage / 100);
  
  // Check if we're in the buffer zone (between 95% and 100% of max area)
  const isInBufferZone = totalArea > bufferThreshold && totalArea <= maxArea;
  
  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
      {artworks.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No artworks added yet</p>
        </div>
      ) : (
        <div className="w-full h-full relative p-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {artworks.map((artwork, index) => (
              <ArtworkElement 
                key={index}
                artwork={artwork}
                scale={scale}
                spacing={spacing}
                totalArtworks={artworks.length}
                totalArea={totalArea}
                maxArea={maxArea}
                index={index}
              />
            ))}
          </div>
          
          {/* Show buffer zone warning if applicable */}
          {isInBufferZone && (
            <div className="absolute bottom-2 right-2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-2 py-1 rounded text-xs">
              Using buffer zone (within 5% of max)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtworksContainer;
