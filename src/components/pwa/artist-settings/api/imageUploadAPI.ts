
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";

/**
 * Upload artist profile image to Supabase Storage
 */
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    logger.info(`Uploading image to profiles/${fileName}`);
    
    // Check if the bucket exists
    const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      logger.error("Error checking storage buckets:", bucketError);
      throw bucketError;
    }
    
    const bucketExists = bucketList?.some(bucket => bucket.name === 'artist-images');
    
    if (!bucketExists) {
      logger.error("The artist-images bucket does not exist. Please run the storage setup SQL.");
      throw new Error("Storage bucket not configured");
    }
    
    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from('artist-images')
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
      .from('artist-images')
      .getPublicUrl(filePath);
    
    logger.info("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};
