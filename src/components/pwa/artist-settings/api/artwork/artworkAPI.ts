
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";
import { ensureBucketExists } from "../storage/storageUtils";

/**
 * Upload artist artwork to Supabase Storage
 */
export const uploadArtwork = async (file: File, artistName: string): Promise<string | null> => {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Sanitize artist name for folder path (replace spaces with underscores)
    const sanitizedArtistName = artistName.replace(/\s+/g, '_');
    
    // Create folder path for artworks
    const folderPath = `${sanitizedArtistName}/Artworks`;
    
    const filePath = `${folderPath}/${fileName}`;
    
    logger.info(`Uploading artwork to ${filePath}`);
    
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
      logger.error("Error uploading artwork:", error);
      throw error;
    }
    
    // Get public URL for the uploaded image
    const publicUrl = supabase.storage
      .from('artists')
      .getPublicUrl(filePath).data.publicUrl;
    
    logger.info("Artwork uploaded successfully:", publicUrl);
    
    return publicUrl;
  } catch (error) {
    logger.error("Error in uploadArtwork:", error);
    return null;
  }
};

/**
 * Update artist background image
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
    
    // Ensure artworkFiles is treated as a Record to avoid spread type error
    let updatedArtworkFiles: Record<string, any> = {};
    
    if (typeof artworkFiles === 'object' && artworkFiles !== null) {
      updatedArtworkFiles = { ...artworkFiles as Record<string, any> };
    }
    
    // Add the background image to the artwork_files object
    updatedArtworkFiles.background_image = imageUrl;
    
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
