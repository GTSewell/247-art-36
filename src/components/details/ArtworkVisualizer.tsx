
import React from 'react';
import { Artwork } from "./types/artwork-types";
import SpaceUsageIndicator from './visualizer/SpaceUsageIndicator';
import ArtworksContainer from './visualizer/ArtworksContainer';
import SpacingNote from './visualizer/SpacingNote';

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
      <SpaceUsageIndicator totalArea={totalArea} maxArea={maxArea} />

      {/* Artworks visualization */}
      <ArtworksContainer artworks={artworks} scale={scale} spacing={spacing} />
      
      {/* Information about spacing */}
      <SpacingNote showNote={artworks.length > 1} spacing={spacing} />
    </div>
  );
};

export default ArtworkVisualizer;
