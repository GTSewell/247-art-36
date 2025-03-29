
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

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
