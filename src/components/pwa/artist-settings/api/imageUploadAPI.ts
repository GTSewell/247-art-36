
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "@/utils/logger";
import { ensureBucketExists } from "./storage/storageUtils";

const BUCKET_NAME = 'artists';

export const uploadImage = async (file: File, artistName: string, isProfileImage: boolean, customFolder?: string): Promise<string | null> => {
  try {
    // Sanitize artist name for folder path
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Construct the storage path - standardize to use the same structure across all uploads
    const folderPath = customFolder 
      ? `${sanitizedArtistName}/${customFolder}`
      : isProfileImage 
        ? `${sanitizedArtistName}/Profile_Image` 
        : `${sanitizedArtistName}/Artworks`;
    
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    
    logger.info(`Uploading ${customFolder || (isProfileImage ? 'profile' : 'artwork')} image to: ${filePath}`);
    
    // Ensure the bucket exists
    await ensureBucketExists(BUCKET_NAME);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      logger.error("Error uploading image:", error);
      return null;
    }
    
    // Get public URL for the uploaded image
    const publicUrl = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath).data.publicUrl;
    
    logger.info(`Image uploaded successfully to: ${publicUrl}`);
    
    return publicUrl;
  } catch (error: any) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};

export const getFilesFromFolder = async (bucketName: string, folderPath: string): Promise<string[]> => {
  try {
    logger.info(`Retrieving files from folder: ${bucketName}/${folderPath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    
    if (error) {
      logger.error("Error listing files:", error);
      return [];
    }
    
    if (!data) {
      logger.warn("No files found in the folder.");
      return [];
    }
    
    const fileUrls = data
      .filter(file => !file.id.endsWith('/')) // Filter out folders
      .map(file => {
        return supabase.storage
          .from(bucketName)
          .getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl;
      });
    
    logger.info(`Found ${fileUrls.length} files in ${bucketName}/${folderPath}`);
    return fileUrls;
  } catch (error: any) {
    logger.error("Error in getFilesFromFolder:", error);
    return [];
  }
};

export const updateArtistBackgroundImage = async (artistId: number, artworkUrl: string): Promise<boolean> => {
  try {
    // Fetch the existing artwork_files to avoid overwriting other properties
    const { data: artistData, error: fetchError } = await supabase
      .from('artists')
      .select('artwork_files')
      .eq('id', artistId)
      .single();
    
    if (fetchError) {
      logger.error("Error fetching artist data:", fetchError);
      return false;
    }
    
    // Fix the spread type issue - ensure artistData.artwork_files is an object
    const existingArtworkFiles = artistData?.artwork_files && typeof artistData.artwork_files === 'object' 
      ? artistData.artwork_files 
      : {};
    
    // Update the artist record with the new background image URL, preserving other artwork_files
    const { error: updateError } = await supabase
      .from('artists')
      .update({ 
        artwork_files: {
          ...existingArtworkFiles,
          background_image: artworkUrl
        }
      })
      .eq('id', artistId);
    
    if (updateError) {
      logger.error("Error updating artist record:", updateError);
      return false;
    }
    
    logger.info(`Artist ${artistId} background image updated successfully to: ${artworkUrl}`);
    return true;
  } catch (error: any) {
    logger.error("Error in updateArtistBackgroundImage:", error);
    return false;
  }
};

export const deleteFileFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    logger.info(`Attempting to delete file: ${fileUrl}`);
    
    // Extract the path from the URL
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`;
    // Extract just the path after the bucket name
    let filePath = fileUrl.replace(baseUrl, '');
    
    logger.info(`Extracted file path: ${filePath}`);
    
    // Delete the file from Supabase storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      logger.error("Error deleting file:", error);
      return false;
    }
    
    logger.info(`File deleted successfully from: ${filePath}`);
    return true;
  } catch (error: any) {
    logger.error("Error in deleteFileFromStorage:", error);
    return false;
  }
};
