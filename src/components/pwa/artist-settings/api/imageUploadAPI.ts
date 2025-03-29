
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a profile image for the given artist.
 * @param file - The file to upload.
 * @param artistName - The artist's name, used to generate a unique file name.
 * @returns The file path if successful, or null on error.
 */
export async function uploadProfileImage(file: File, artistName: string): Promise<string | null> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${artistName}-${uuidv4()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Call the upload method with only 2 arguments
    const { data, error } = await supabase
      .storage
      .from('profile-images')
      .upload(filePath, file); // Removed the third argument here

    if (error) {
      logger.error("Error uploading profile image:", error);
      return null;
    }

    return filePath;
  } catch (err) {
    logger.error("Upload failed:", err);
    return null;
  }
}

/**
 * Updates the artist's profile image URL.
 * @param artistId - The artist's ID.
 * @param imageUrl - The new profile image URL.
 */
export async function updateArtistProfileImage(artistId: string | number, imageUrl: string): Promise<boolean> {
  try {
    // Convert artistId to number if it's a string
    const numericArtistId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
    
    const { error } = await supabase
      .from('artists')
      .update({ profile_image_url: imageUrl })
      .eq('id', numericArtistId);
    
    if (error) {
      logger.error("Error updating artist profile image:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error("Update failed:", err);
    return false;
  }
}

/**
 * Uploads an image, either a profile image or artwork.
 * @param file - The file to upload.
 * @param artistName - The artist's name, used for folder organization.
 * @param isProfileImage - Whether this is a profile image or artwork.
 * @returns The URL of the uploaded image, or null on error.
 */
export async function uploadImage(file: File, artistName: string, isProfileImage: boolean = true): Promise<string | null> {
  try {
    // Sanitize artist name for folder path
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Determine storage path based on image type
    let bucketName, folderPath;
    
    if (isProfileImage) {
      bucketName = 'profile-images';
      folderPath = sanitizedArtistName;
    } else {
      bucketName = 'artists';
      folderPath = `${sanitizedArtistName}/Artworks`;
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const uniqueId = uuidv4();
    const fileName = isProfileImage 
      ? `profile-${uniqueId}.${fileExt}` 
      : `artwork-${uniqueId}.${fileExt}`;
    
    const filePath = `${folderPath}/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file);
    
    if (error) {
      logger.error(`Error uploading ${isProfileImage ? 'profile image' : 'artwork'}:`, error);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (err) {
    logger.error("Upload failed:", err);
    return null;
  }
}

/**
 * Gets all files from a specific folder in storage.
 * @param bucketName - The name of the storage bucket.
 * @param folderPath - The path to the folder.
 * @returns An array of file URLs.
 */
export async function getFilesFromFolder(bucketName: string, folderPath: string): Promise<string[]> {
  try {
    // List all files in the folder
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath);
    
    if (error) {
      logger.error("Error listing files:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Generate public URLs for all files
    return data
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(item => {
        const { data: urlData } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(`${folderPath}/${item.name}`);
        
        return urlData.publicUrl;
      });
  } catch (err) {
    logger.error("Error getting files from folder:", err);
    return [];
  }
}

/**
 * Updates the artist's background image.
 * @param artistId - The artist's ID.
 * @param imageUrl - The URL of the background image.
 * @returns Whether the update was successful.
 */
export async function updateArtistBackgroundImage(artistId: number | string, imageUrl: string): Promise<boolean> {
  try {
    // Convert artistId to number if it's a string
    const numericArtistId = typeof artistId === 'string' ? parseInt(artistId, 10) : artistId;
    
    // First, get the current artwork_files object
    const { data: artistData, error: fetchError } = await supabase
      .from('artists')
      .select('artwork_files')
      .eq('id', numericArtistId)
      .single();
    
    if (fetchError) {
      logger.error("Error fetching artist data:", fetchError);
      return false;
    }
    
    // Update the background_image property
    const updatedArtworkFiles = artistData.artwork_files || {};
    updatedArtworkFiles.background_image = imageUrl;
    
    // Update the artist record
    const { error: updateError } = await supabase
      .from('artists')
      .update({ artwork_files: updatedArtworkFiles })
      .eq('id', numericArtistId);
    
    if (updateError) {
      logger.error("Error updating artist background image:", updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error("Update failed:", err);
    return false;
  }
}

/**
 * Deletes a file from storage.
 * @param fileUrl - The URL of the file to delete.
 * @returns Whether the deletion was successful.
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<boolean> {
  try {
    // Extract bucket and path from URL
    // Example URL: https://storage.domain.com/bucket/path/to/file.ext
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    
    // The first part after the leading slash is the bucket name
    const bucketName = pathParts[1];
    
    // The rest is the file path
    const filePath = pathParts.slice(2).join('/');
    
    if (!bucketName || !filePath) {
      logger.error("Invalid file URL:", fileUrl);
      return false;
    }
    
    // Delete the file
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      logger.error("Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error("Deletion failed:", err);
    return false;
  }
}
