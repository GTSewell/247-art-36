
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
      logger.info(`Artist data retrieved: ${data.name} (ID: ${data.id})`);
    }
    
    return { data, error: null };
  } catch (error: any) {
    logger.error("Error fetching artist profile:", error);
    return { data: null, error };
  }
};

/**
 * Helper function to process comma or space separated string to array
 */
const processStringToArray = (input: string): string[] => {
  if (!input || input.trim() === '') return [];
  
  // First check if it contains commas
  if (input.includes(',')) {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  
  // If no commas, try splitting by spaces, but be careful with multi-word phrases
  return input
    .split(/\s+/)
    .filter(item => item.length > 0);
};

/**
 * Get the next available artist ID
 */
const getNextArtistId = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('artists')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.message.includes('No rows found')) {
        return 1; // Start with ID 1 if no artists exist
      }
      throw error;
    }
    
    return data.id + 1;
  } catch (error: any) {
    logger.error("Error getting next artist ID:", error);
    throw error;
  }
}

/**
 * Create or update artist profile in Supabase
 */
export const saveArtistProfile = async (formData: ArtistProfileFormData, artistId: string | null, existingArtist: any) => {
  try {
    // Process array values - ensure they're stored as proper JSON arrays for JSONB columns
    logger.info("Processing form data for saving:", formData);
    
    // Process techniques with more thorough conversion
    let techniques: string[] = [];
    if (formData.techniques) {
      techniques = processStringToArray(formData.techniques);
      logger.info("Processed techniques:", techniques);
    }
    
    // Process styles with more thorough conversion
    let styles: string[] = [];
    if (formData.styles) {
      styles = processStringToArray(formData.styles);
      logger.info("Processed styles:", styles);
    }
    
    // Process social platforms
    const socialPlatforms = processSocialPlatforms(formData.social_platforms);
    logger.info("Processed social platforms:", socialPlatforms);
    
    const processedData = {
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      city: formData.city,
      country: formData.country,
      techniques: techniques,
      styles: styles,
      social_platforms: socialPlatforms,
      image: formData.image,
      // If existingArtist has a published property, keep it; otherwise, default to false
      published: existingArtist?.published === true
    };
    
    // Log the final processed data before saving
    logger.info("Final processed data for saving:", processedData);
    
    if (artistId && existingArtist) {
      // Convert string id to number for database operations
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      logger.info("Updating existing artist profile with ID:", numericId);
      
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
      // For new artist profiles, get the next available ID
      const nextId = await getNextArtistId();
      logger.info("Creating new artist with ID:", nextId);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      logger.info("Current user:", user?.id);
      
      // Create new artist profile with the new ID and the current user's ID
      const { data, error } = await supabase
        .from('artists')
        .insert([{
          id: nextId,
          ...processedData,
          published: false, // Set published to false by default for new artists
          locked_artworks: false, // Ensure new artists can have artworks uploaded
          artwork_files: [], // Initialize empty artwork files array
          user_id: user?.id // Add the authenticated user's ID to link to this artist
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
