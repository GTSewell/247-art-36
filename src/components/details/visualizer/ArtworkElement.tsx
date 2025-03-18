
import React from 'react';
import { Artwork } from '../types/artwork-types';
import SpacingIndicator from './SpacingIndicator';

interface ArtworkElementProps {
  artwork: Artwork;
  index: number;
  scale: number;
  spacing: number;
  totalArtworks?: number;
}

const ArtworkElement: React.FC<ArtworkElementProps> = ({ 
  artwork, 
  index, 
  scale, 
  spacing,
  totalArtworks = 0
}) => {
  // Handle empty string values
  const width = artwork.width === '' ? 0 : Number(artwork.width);
  const height = artwork.height === '' ? 0 : Number(artwork.height);
  
  // Calculate the visual width and height for this element
  const visualWidth = width * scale;
  const visualHeight = height * scale;
  
  // Determine if there are multiple artworks
  const multipleArtworks = totalArtworks > 1;
  
  // Determine border color based on fits property
  const borderColor = artwork.fits ? 'border-green-500' : 'border-red-500';

  // Calculate base area
  const baseArea = width * height;

  return (
    <div className="text-center">
      <div className="mb-2 text-sm font-medium">Artwork {index + 1}</div>
      <div 
        className={`relative border-2 ${borderColor}`}
        style={{ 
          width: `${visualWidth || 60}px`, 
          height: `${visualHeight || 60}px`,
          minWidth: '60px',
          minHeight: '60px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-xs">
          {width} × {height} cm
        </div>
        
        {/* Show spacing visualization if there are multiple artworks */}
        {multipleArtworks && (
          <SpacingIndicator scale={scale} spacing={spacing} />
        )}
      </div>
      <div className="mt-1 text-xs">
        Base Area: {baseArea} sq cm
        {artwork.area !== baseArea && baseArea > 0 && (
          <div className="text-gray-500">
            With spacing: {artwork.area} sq cm
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkElement;
