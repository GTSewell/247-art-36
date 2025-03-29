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
export async function updateArtistProfileImage(artistId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('artists')
    .update({ profile_image: imageUrl })
    .eq('id', artistId);
  
  if (error) {
    logger.error("Error updating artist profile image:", error);
    throw error;
  }
}
