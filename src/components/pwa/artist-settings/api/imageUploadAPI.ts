
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
    
    // Upload image to Supabase - fixed argument count
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
    
    // Get current artist data
    const { data: artistData, error: getError } = await supabase
      .from('artists')
      .select('artworks, artwork_files')
      .eq('id', artistId)
      .single();
    
    if (getError) {
      logger.error("Error fetching artist data:", getError);
      return false;
    }
    
    // Get current artworks or initialize as empty array
    let artworks = artistData.artworks;
    if (!artworks) {
      artworks = [];
    } else if (!Array.isArray(artworks)) {
      // Convert to array if not already
      try {
        artworks = JSON.parse(String(artworks));
        if (!Array.isArray(artworks)) {
          artworks = [artworks];
        }
      } catch {
        artworks = [artworks];
      }
    }
    
    // Prepare artwork_files with background_image
    const artworkFiles = artistData.artwork_files || {};
    const updatedArtworkFiles = {
      ...artworkFiles,
      background_image: imageUrl
    };
    
    // Update the artist with background image info
    const { error } = await supabase
      .from('artists')
      .update({ 
        artworks: artworks,
        artwork_files: updatedArtworkFiles
      })
      .eq('id', artistId);
    
    if (error) {
      logger.error("Error updating artist background image:", error);
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

/**
 * Delete a file from storage
 */
export const deleteFileFromStorage = async (fileUrl: string, bucketName: string = 'artists'): Promise<boolean> => {
  try {
    logger.info(`Attempting to delete file: ${fileUrl}`);
    
    // Extract the file path from the URL
    // URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the position of 'public' and the bucket name in the path
    const publicIndex = pathParts.findIndex(part => part === 'public');
    const bucketIndex = publicIndex + 1;
    
    if (publicIndex === -1 || bucketIndex >= pathParts.length) {
      throw new Error(`Invalid storage URL format: ${fileUrl}`);
    }
    
    // The actual file path is everything after the bucket name
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    logger.info(`Extracted file path: ${filePath} from bucket: ${bucketName}`);
    
    // Delete the file from storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    logger.info(`Successfully deleted file: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting file from storage:`, error);
    return false;
  }
};
