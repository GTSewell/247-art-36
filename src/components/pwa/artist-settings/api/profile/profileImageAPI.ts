
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";
import { ensureBucketExists } from "../storage/storageUtils";

/**
 * Upload artist profile image to Supabase Storage
 */
export const uploadProfileImage = async (file: File, artistName: string): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Sanitize artist name for folder path (replace spaces with underscores)
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Create folder path based on artist name
    const folderPath = `${sanitizedArtistName}/Profile_Image`;
    
    const filePath = `${folderPath}/${fileName}`;
    
    logger.info(`Uploading profile image to ${filePath}`);
    
    // First ensure the bucket exists
    await ensureBucketExists('artists');
    
    // Upload image to Supabase
    // Fixed: Passing options as part of the file object parameter to match type definitions
    const { data, error } = await supabase.storage
      .from('artists')
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: true 
      });
    
    if (error) {
      logger.error("Error uploading profile image:", error);
      throw error;
    }
    
    // Get public URL for the uploaded image
    const publicUrl = supabase.storage
      .from('artists')
      .getPublicUrl(filePath).data.publicUrl;
    
    logger.info("Profile image uploaded successfully:", publicUrl);
    
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadProfileImage:", error);
    return null;
  }
};

/**
 * Update artist profile image in the database
 */
export const updateArtistProfileImage = async (artistId: number, imageUrl: string): Promise<boolean> => {
  try {
    logger.info(`Updating profile image for artist ID ${artistId} with URL: ${imageUrl}`);
    
    const { data, error } = await supabase
      .from('artists')
      .update({ 
        image: imageUrl,
        profile_image_url: imageUrl // Update both image columns to maintain consistency
      })
      .eq('id', artistId)
      .select();
      
    if (error) {
      logger.error("Error updating artist profile image:", error);
      return false;
    }
    
    logger.info("Artist profile image updated successfully for ID:", artistId, data);
    return true;
  } catch (error) {
    logger.error("Error in updateArtistProfileImage:", error);
    return false;
  }
};
