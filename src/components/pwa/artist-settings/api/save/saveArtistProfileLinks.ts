import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { ArtistLink } from "@/data/types/artistProfile";

/**
 * Save artist profile links to Supabase
 */
export const saveArtistProfileLinks = async (artistId: string, links: ArtistLink[]): Promise<{ success: boolean, error: any }> => {
  try {
    logger.info("Saving artist profile links for ID:", artistId);
    
    // Convert string id to number for database query
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID: ${artistId}`);
    }

    // First check if artist profile exists
    const { data: existingProfile } = await (supabase as any)
      .from('artist_profiles')
      .select('id')
      .eq('artist_id', numericId)
      .maybeSingle();

    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await (supabase as any)
        .from('artist_profiles')
        .update({ 
          links: links,
          updated_at: new Date().toISOString()
        })
        .eq('artist_id', numericId);
    } else {
      // Create new profile
      result = await (supabase as any)
        .from('artist_profiles')
        .insert({
          artist_id: numericId,
          links: links
        });
    }

    if (result.error) {
      logger.error("Supabase error saving artist profile links:", result.error);
      return { success: false, error: result.error };
    }

    logger.info("Artist profile links saved successfully");
    return { success: true, error: null };
  } catch (error: any) {
    logger.error("Error saving artist profile links:", error);
    return { success: false, error };
  }
};