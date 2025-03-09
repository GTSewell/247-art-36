
import { Artist } from '@/data/types/artist';
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";
import { ArtistSearchResult } from './types';
import { searchArtistBasic } from './searchStrategies/basicSearch';
import { searchArtistAdvanced } from './searchStrategies/advancedSearch';

/**
 * Strategy for finding an artist by name
 * Tries multiple search strategies in sequence until one succeeds
 */
export async function findArtistByName(artistName: string): Promise<ArtistSearchResult> {
  try {
    logger.info(`Finding artist by name: ${artistName}`);
    
    // Remove any spaces in the artist name to match URL format
    const formattedName = artistName.replace(/\s+/g, '');
    
    // Strategy 1: Basic search - exact match on formatted name
    let result = await searchArtistBasic(formattedName);
    
    if (result.artistData) {
      logger.info(`Found artist using basic search: ${result.artistData.name}`);
      return result;
    }
    
    // Strategy 2: Advanced search - try more complex matching
    result = await searchArtistAdvanced(formattedName);
    
    if (result.artistData) {
      logger.info(`Found artist using advanced search: ${result.artistData.name}`);
      return result;
    }
    
    // If both strategies fail, return error
    logger.warn(`No artist found with name: ${artistName}`);
    return { 
      artistData: null, 
      artistError: new Error(`Artist not found: ${artistName}`) 
    };
  } catch (error: any) {
    logger.error("Error in findArtistByName:", error);
    return { 
      artistData: null, 
      artistError: error 
    };
  }
}
