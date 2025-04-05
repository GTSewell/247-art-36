
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { ArtistProfile } from "../../types";
import { processArtistData } from "@/components/artistSubdomain/utils/artistDataProcessor";

/**
 * Fetch artist profile from Supabase
 */
export const fetchArtistProfile = async (artistId: string): Promise<{ data: ArtistProfile | null, error: any }> => {
  try {
    logger.info("Fetching artist with ID:", artistId);
    
    // Convert string id to number for database query
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID format: ${artistId}`);
    }
    
    // Query artist by id (numeric id, not user_id)
    const { data: rawData, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();
    
    if (error) {
      logger.error("Database error fetching artist:", error);
      throw error;
    }
    
    if (!rawData) {
      logger.warn(`No artist found with id: ${artistId}`);
      return { data: null, error: null };
    }
    
    // Process the raw data to ensure all fields have the correct types
    const processedArtist = processArtistData(rawData);
    
    if (!processedArtist) {
      logger.error("Failed to process artist data");
      return { data: null, error: new Error("Failed to process artist data") };
    }
    
    // Cast the processed artist to ArtistProfile type
    const artistProfile: ArtistProfile = {
      ...processedArtist,
      id: processedArtist.id,
      user_id: processedArtist.user_id || undefined,
      name: processedArtist.name || "",
      bio: processedArtist.bio || undefined,
      image: processedArtist.image || undefined,
      techniques: Array.isArray(processedArtist.techniques) 
        ? processedArtist.techniques 
        : [],
      styles: Array.isArray(processedArtist.styles)
        ? processedArtist.styles
        : [],
      social_platforms: Array.isArray(processedArtist.social_platforms)
        ? processedArtist.social_platforms
        : [],
      artworks: Array.isArray(processedArtist.artworks) 
        ? processedArtist.artworks 
        : []
    };
    
    logger.info(`Artist data retrieved: ${artistProfile.name} (ID: ${artistProfile.id})`);
    return { data: artistProfile, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist profile:", error);
    return { data: null, error };
  }
};
