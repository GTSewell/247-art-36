
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";

/**
 * Upload artist profile image or artwork to Supabase Storage
 */
export const uploadImage = async (file: File, artistName: string, isProfileImage: boolean = true): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Sanitize artist name for folder path (replace spaces with underscores)
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Create folder path based on artist name and image type
    const folderPath = isProfileImage 
      ? `${sanitizedArtistName}/Profile_Image` 
      : `${sanitizedArtistName}/Artworks`;
    
    const filePath = `${folderPath}/${fileName}`;
    
    logger.info(`Uploading ${isProfileImage ? 'profile image' : 'artwork'} to ${filePath}`);
    
    // First ensure the bucket exists
    await ensureBucketExists('artists');
    
    // Upload image to Supabase
    const { data, error } = await supabase.storage
      .from('artists')
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
      .from('artists')
      .getPublicUrl(filePath);
    
    logger.info("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};

/**
 * Ensure the storage bucket exists
 */
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      logger.error("Error checking buckets:", bucketsError);
      throw bucketsError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      logger.info(`Creating bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (createError) {
        logger.error("Error creating bucket:", createError);
        throw createError;
      }
      
      logger.info(`Bucket ${bucketName} created successfully`);
    } else {
      logger.info(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (error) {
    logger.error("Error in ensureBucketExists:", error);
    return false;
  }
};
