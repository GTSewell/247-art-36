import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../../types";
import { logger } from "@/utils/logger";
import { processStringToArray, getNextArtistId } from "../utils/dataProcessingUtils";
import { processSocialPlatforms } from "../../utils/socialPlatformUtils";

/**
 * Create or update artist profile in Supabase
 */
export const saveArtistProfile = async (formData: ArtistProfileFormData, artistId: string | null) => {
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
      // If an existing artist has published=true, keep it; otherwise, default to false
      published: formData.published === true
    };
    
    // Log the final processed data before saving
    logger.info("Final processed data for saving:", processedData);
    
    if (artistId) {
      return await updateExistingArtist(artistId, processedData);
    } else {
      return await createNewArtist(processedData);
    }
  } catch (error: any) {
    logger.error("Error saving artist profile:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Update an existing artist profile
 */
const updateExistingArtist = async (artistId: string, processedData: any) => {
  try {
    // Convert string id to number for database operations
    const numericId = parseInt(artistId, 10);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid artist ID format: ${artistId}`);
    }
    
    logger.info("Updating existing artist profile with ID:", numericId);
    
    // Fetch existing artist to check published status
    const { data: existingArtist, error: fetchError } = await supabase
      .from('artists')
      .select('published')
      .eq('id', numericId)
      .single();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      throw fetchError;
    }
    
    // If artist exists, use its published status
    if (existingArtist) {
      processedData.published = existingArtist.published === true;
    }
    
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
  } catch (error: any) {
    logger.error("Error updating artist:", error);
    throw error;
  }
};

/**
 * Create a new artist profile
 */
const createNewArtist = async (processedData: any) => {
  try {
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
        artwork_files: {}, // Initialize empty artwork files object
        user_id: user?.id // Add the authenticated user's ID to link to this artist
      }])
      .select();
    
    if (error) {
      logger.error("Insert error:", error);
      throw error;
    }
    
    logger.info("Created artist data:", data);
    return { success: true, message: "Profile created successfully", data };
  } catch (error: any) {
    logger.error("Error creating artist:", error);
    throw error;
  }
};
