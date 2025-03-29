import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../types";
import { processSocialPlatforms } from "../utils/socialPlatformUtils";
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
      logger.info("Artist data retrieved:", data);
    }
    
    return { data, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist profile:", error);
    return { data: null, error };
  }
};

/**
 * Create or update artist profile in Supabase
 */
export const saveArtistProfile = async (formData: ArtistProfileFormData, artistId: string, existingArtist: any) => {
  try {
    // Process array values
    const processedData = {
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      city: formData.city,
      country: formData.country,
      techniques: formData.techniques.split(',').map(item => item.trim()).filter(item => item),
      styles: formData.styles.split(',').map(item => item.trim()).filter(item => item),
      social_platforms: processSocialPlatforms(formData.social_platforms),
      image: formData.image,
      // If existingArtist has a published property, keep it; otherwise, default to false
      published: existingArtist?.published === true
    };
    
    // Convert string id to number for database operations
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID format: ${artistId}`);
    }
    
    logger.info("Saving artist profile with ID:", numericId);
    logger.info("Processed data:", processedData);
    
    if (existingArtist) {
      // Update existing artist profile
      const { data, error } = await supabase
        .from('artists')
        .update(processedData)
        .eq('id', numericId)
        .select();
      
      if (error) {
        logger.error("Update error:", error);
        throw error;
      }
      
      logger.info("Updated artist data:", data);
      return { success: true, message: "Profile updated successfully", data };
    } else {
      // For new artist profiles, get the next available ID from the sequence
      const { data: maxIdData, error: maxIdError } = await supabase
        .from('artists')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      if (maxIdError && !maxIdError.message.includes('No rows found')) {
        throw maxIdError;
      }
      
      // Calculate next ID (either increment max ID or start at 1)
      const nextId = maxIdData ? maxIdData.id + 1 : 1;
      
      // Create new artist profile with the new ID
      const { data, error } = await supabase
        .from('artists')
        .insert([{
          id: nextId,
          ...processedData,
          published: false // Set published to false by default for new artists
        }])
        .select();
      
      if (error) {
        logger.error("Insert error:", error);
        throw error;
      }
      
      logger.info("Created artist data:", data);
      return { success: true, message: "Profile created successfully", data };
    }
  } catch (error: any) {
    logger.error("Error saving artist profile:", error);
    return { success: false, message: error.message };
  }
};
