
import { ensureArray } from "@/utils/ensureArray";

/**
 * Process artist artworks to ensure proper format
 */
export const processArtworks = (artworksData: any): string[] => {
  try {
    if (!artworksData) return [];
    
    // Convert artworks from JSON to array of strings
    const artworkArray = ensureArray(artworksData);
    
    // Map array to ensure each element is a string
    return artworkArray.map(artwork => artwork.toString());
  } catch (error) {
    console.error("Error processing artworks:", error);
    return [];
  }
};
