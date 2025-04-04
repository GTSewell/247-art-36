
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

/**
 * Fetch artist profile from Supabase
 */
export const fetchArtistProfile = async (artistId: string) => {
  try {
    logger.info("Fetching artist with ID:", artistId);
    
    // Convert string id to number for database query
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID format: ${artistId}`);
    }
    
    // Query artist by id (numeric id, not user_id)
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();
    
    if (error) {
      logger.error("Database error fetching artist:", error);
      throw error;
    }
    
    if (!data) {
      logger.warn(`No artist found with id: ${artistId}`);
    } else {
      logger.info(`Artist data retrieved: ${data.name} (ID: ${data.id})`);
    }
    
    return { data, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist profile:", error);
    return { data: null, error };
  }
};
