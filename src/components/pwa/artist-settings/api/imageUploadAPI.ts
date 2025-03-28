
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";

/**
 * Upload artist profile image to Supabase Storage
 */
export const uploadImage = async (file: File, artistName: string, isProfileImage: boolean = true): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create folder path based on artist name and image type
    const folderPath = isProfileImage 
      ? `${artistName}/Profile Image` 
      : `${artistName}/Artworks`;
    
    const filePath = `${folderPath}/${fileName}`;
    
    logger.info(`Uploading ${isProfileImage ? 'profile image' : 'artwork'} to ${filePath}`);
    
    // Check if the bucket exists
    const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      logger.error("Error checking storage buckets:", bucketError);
      throw bucketError;
    }
    
    // Check for both buckets since we're transitioning
    const artistBucketExists = bucketList?.some(bucket => bucket.name === 'Artists');
    const legacyBucketExists = bucketList?.some(bucket => bucket.name === 'artist-images');
    
    let bucketName = 'artists';
    
    if (!artistBucketExists && !legacyBucketExists) {
      logger.error("Neither 'artists' nor 'artist-images' bucket exists. Please run the storage setup SQL.");
      throw new Error("Storage bucket not configured");
    } else if (!artistBucketExists && legacyBucketExists) {
      // Fall back to legacy bucket if new one doesn't exist
      bucketName = 'artist-images';
      logger.warn("Using legacy 'artist-images' bucket as 'artists' bucket does not exist");
    }
    
    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      logger.error("Error uploading image:", error);
      throw error;
    }
    
    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    logger.info("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};
