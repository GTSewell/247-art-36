
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { ArtistSearchResult } from '../types';
import { Artist } from "@/data/types/artist";

/**
 * Advanced search strategy - try various matching techniques
 */
export async function searchArtistAdvanced(formattedName: string): Promise<ArtistSearchResult> {
  try {
    logger.info(`Executing advanced search for artist: ${formattedName}`);
    
    // Try matching with various patterns
    const { data: artistsData, error } = await supabase
      .from('artists')
      .select('*');
    
    if (error) {
      logger.error("Error in advanced search:", error);
      return { artistData: null, artistError: error };
    }
    
    if (!artistsData || artistsData.length === 0) {
      logger.info("No artists found in database");
      return { artistData: null, artistError: null };
    }
    
    // Try to find the best match by comparing formatted names
    const foundArtist = findBestMatch(artistsData, formattedName);
    
    if (foundArtist) {
      logger.info(`Advanced search found artist: ${foundArtist.name}`);
      return { artistData: foundArtist, artistError: null };
    }
    
    logger.info(`No matches found in advanced search for: ${formattedName}`);
    return { artistData: null, artistError: null };
  } catch (error: any) {
    logger.error("Error in searchArtistAdvanced:", error);
    return { artistData: null, artistError: error };
  }
}

/**
 * Find the best match from a list of artists
 */
function findBestMatch(artists: Artist[], formattedNameQuery: string): Artist | null {
  // First try: Exact match after formatting
  for (const artist of artists) {
    const artistFormattedName = artist.name?.replace(/\s+/g, '') || '';
    if (artistFormattedName.toLowerCase() === formattedNameQuery.toLowerCase()) {
      return artist;
    }
  }
  
  // Second try: Partial match (contains)
  for (const artist of artists) {
    const artistFormattedName = artist.name?.replace(/\s+/g, '') || '';
    if (
      artistFormattedName.toLowerCase().includes(formattedNameQuery.toLowerCase()) ||
      formattedNameQuery.toLowerCase().includes(artistFormattedName.toLowerCase())
    ) {
      return artist;
    }
  }
  
  // No match found
  return null;
}
