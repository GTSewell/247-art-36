
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
  // Buffer calculation remains for internal use but we're removing the notification
  const bufferPercentage = 5; // 5% buffer
  const bufferThreshold = maxArea * (1 - bufferPercentage / 100);
  
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
          
          {/* Removed buffer zone notification */}
        </div>
      )}
    </div>
  );
};

export default ArtworksContainer;
