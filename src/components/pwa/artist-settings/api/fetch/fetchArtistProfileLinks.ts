import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { ArtistLink } from "@/data/types/artistProfile";

/**
 * Fetch artist profile links from Supabase
 */
export const fetchArtistProfileLinks = async (artistId: string): Promise<{ data: ArtistLink[] | null, error: any }> => {
  try {
    logger.info("Fetching artist profile links for ID:", artistId);
    
    // Convert string id to number for database query
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID: ${artistId}`);
    }

    // Use type assertion since artist_profiles table doesn't exist in types yet
    const { data, error } = await (supabase as any)
      .from('artist_profiles')
      .select('links')
      .eq('artist_id', numericId)
      .maybeSingle();

    if (error) {
      logger.error("Supabase error fetching artist profile links:", error);
      return { data: null, error };
    }

    if (!data) {
      logger.info("No artist profile found for ID:", artistId);
      return { data: [], error: null };
    }

    const links = Array.isArray(data.links) ? data.links : [];
    logger.info("Artist profile links retrieved:", links);
    
    return { data: links, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist profile links:", error);
    return { data: null, error };
  }
};