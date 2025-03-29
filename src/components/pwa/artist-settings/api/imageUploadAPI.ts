import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "@/utils/logger";

const BUCKET_NAME = 'artists';

export const uploadImage = async (file: File, artistName: string, isProfileImage: boolean): Promise<string | null> => {
  try {
    // Sanitize artist name for folder path
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Construct the storage path
    const folderPath = `artists/${sanitizedArtistName}/${isProfileImage ? 'Profile' : 'Artworks'}`;
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    
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
    
    // Construct the public URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
    logger.info(`Image uploaded successfully to: ${imageUrl}`);
    
    return imageUrl;
  } catch (error: any) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};

export const getFilesFromFolder = async (bucketName: string, folderPath: string): Promise<string[]> => {
  try {
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
    
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const fileUrls = data.map(file => baseUrl + folderPath + '/' + file.name);
    
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
    
    const existingArtworkFiles = artistData?.artwork_files || {};
    
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
    // Extract the path from the URL
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artists/`;
    const filePath = fileUrl.replace(baseUrl, 'artists/');
    
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
