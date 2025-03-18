
import { Artwork, SPACING_CM, BUFFER_PERCENTAGE } from "../types/artwork-types";

export const generateId = (): number => {
  return Date.now();
};

export const calculateArtworkArea = (artwork: Artwork, artworksCount: number): number => {
  if (artworksCount > 1) {
    const adjustedWidth = artwork.width + (SPACING_CM * 2);
    const adjustedHeight = artwork.height + (SPACING_CM * 2);
    return adjustedWidth * adjustedHeight;
  }
  return artwork.width * artwork.height;
};

export const calculateTotalAreaWithFits = (
  updatedArtworks: Artwork[], 
  maxAllowedArea: number
): { artworks: Artwork[]; totalArea: number } => {
  const artworksCount = updatedArtworks.length;
  
  let calculatedTotalArea = 0;
  const updatedWithAreas = updatedArtworks.map(artwork => {
    const area = calculateArtworkArea(artwork, artworksCount);
    calculatedTotalArea += area;
    return { ...artwork, area };
  });

  // Calculate buffer threshold
  const bufferThreshold = maxAllowedArea * (1 + BUFFER_PERCENTAGE / 100);
  
  const finalArtworks = updatedWithAreas.map(artwork => {
    const fits = calculatedTotalArea <= maxAllowedArea;
    // Artwork is in buffer if total area exceeds max but is within buffer threshold
    const inBuffer = !fits && calculatedTotalArea <= bufferThreshold;
    
    return {
      ...artwork,
      fits,
      inBuffer
    };
  });

  return {
    artworks: finalArtworks,
    totalArea: calculatedTotalArea
  };
};
