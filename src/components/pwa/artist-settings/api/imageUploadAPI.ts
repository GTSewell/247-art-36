
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
    // The Supabase upload method expects:
    // 1. The path where the file should be stored
    // 2. The file content (and options are passed as part of this upload call)
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
    const publicUrl = supabase.storage
      .from('artists')
      .getPublicUrl(filePath).data.publicUrl;
    
    logger.info("Image uploaded successfully:", publicUrl);
    
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadImage:", error);
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

/**
 * Update artist profile background image
 */
export const updateArtistBackgroundImage = async (artistId: number, imageUrl: string): Promise<boolean> => {
  try {
    logger.info(`Updating background image for artist ID ${artistId} with URL: ${imageUrl}`);
    
    // First, check if the artist has a profile record
    const { data: profiles, error: profileError } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('artist_id', artistId.toString())
      .maybeSingle();
    
    if (profileError) {
      logger.error("Error checking artist profile:", profileError);
      throw profileError;
    }
    
    let result;
    
    if (profiles) {
      // Update existing profile
      result = await supabase
        .from('artist_profiles')
        .update({ 
          background_image: imageUrl
        })
        .eq('artist_id', artistId.toString());
    } else {
      // Create new profile with default values
      result = await supabase
        .from('artist_profiles')
        .insert({ 
          artist_id: artistId.toString(),
          background_image: imageUrl,
          background_color: '#f0f0f0', // Default light gray
          panel_color: '#ffffff', // Default white
          links: []
        });
    }
    
    if (result.error) {
      logger.error("Error updating artist background image:", result.error);
      return false;
    }
    
    logger.info("Artist background image updated successfully for ID:", artistId);
    return true;
  } catch (error) {
    logger.error("Error in updateArtistBackgroundImage:", error);
    return false;
  }
};

/**
 * Get all files from a specific folder in the storage bucket
 */
export const getFilesFromFolder = async (bucketName: string, folderPath: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath);
    
    if (error) {
      logger.error(`Error listing files in ${folderPath}:`, error);
      return [];
    }
    
    // Convert file list to public URLs
    const fileUrls = data
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(file => {
        return supabase.storage
          .from(bucketName)
          .getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl;
      });
    
    return fileUrls;
  } catch (error) {
    logger.error(`Error in getFilesFromFolder (${folderPath}):`, error);
    return [];
  }
};
