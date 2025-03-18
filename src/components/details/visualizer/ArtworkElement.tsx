
import React from 'react';
import { Artwork } from '../types/artwork-types';
import SpacingIndicator from './SpacingIndicator';

interface ArtworkElementProps {
  artwork: Artwork;
  index: number;
  scale: number;
  spacing: number;
  multipleArtworks: boolean;
}

const ArtworkElement: React.FC<ArtworkElementProps> = ({ 
  artwork, 
  index, 
  scale, 
  spacing,
  multipleArtworks
}) => {
  // Calculate the visual width and height for this element
  const visualWidth = artwork.width * scale;
  const visualHeight = artwork.height * scale;

  return (
    <div className="text-center">
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
        {multipleArtworks && (
          <SpacingIndicator scale={scale} spacing={spacing} />
        )}
      </div>
      <div className="mt-1 text-xs">
        {artwork.width * artwork.height} sq cm
        {multipleArtworks && (
          <div className="text-gray-500">
            With spacing: {artwork.area} sq cm
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkElement;
