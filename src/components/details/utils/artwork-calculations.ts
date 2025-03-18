
import { Artwork, SPACING_CM } from "../types/artwork-types";

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

  const finalArtworks = updatedWithAreas.map(artwork => ({
    ...artwork,
    fits: calculatedTotalArea <= maxAllowedArea
  }));

  return {
    artworks: finalArtworks,
    totalArea: calculatedTotalArea
  };
};
