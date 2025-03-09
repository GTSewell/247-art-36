
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { ArtistSearchResult } from '../types';
import { processArtistData } from "../../utils/artistDataProcessor";

/**
 * Basic search strategy - direct match on name
 */
export async function searchArtistBasic(formattedName: string): Promise<ArtistSearchResult> {
  try {
    logger.info(`Executing basic search for artist: ${formattedName}`);
    
    // First, try searching by formatted name (no spaces)
    const { data: artistData, error } = await supabase
      .from('artists')
      .select('*')
      .or(`name.ilike.${formattedName},name.ilike.%${formattedName}%`)
      .single();
    
    if (error) {
      // If it's not a "no rows returned" error, it's a real error
      if (!error.message.includes('no rows')) {
        logger.error("Error in basic search:", error);
        return { artistData: null, artistError: error };
      }
      
      // No results found in basic search
      logger.info(`No results found in basic search for: ${formattedName}`);
      return { artistData: null, artistError: null };
    }
    
    if (artistData) {
      logger.info(`Basic search found artist: ${artistData.name}`);
      // Process artist data to ensure proper typing
      const processedArtist = processArtistData(artistData);
      return { artistData: processedArtist, artistError: null };
    }
    
    return { artistData: null, artistError: null };
  } catch (error: any) {
    logger.error("Error in searchArtistBasic:", error);
    return { artistData: null, artistError: error };
  }
}
