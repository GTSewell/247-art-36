
import React from 'react';
import { Artwork } from '../types/artwork-types';
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
  const multipleArtworks = artworks.length > 1;

  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 flex flex-wrap gap-4 justify-center bg-gray-50">
      {artworks.map((artwork, index) => (
        <ArtworkElement
          key={artwork.id}
          artwork={artwork}
          index={index}
          scale={scale}
          spacing={spacing}
          multipleArtworks={multipleArtworks}
          totalArea={totalArea}
          maxArea={maxArea}
        />
      ))}
    </div>
  );
};

export default ArtworksContainer;
