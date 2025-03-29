
import { logger } from "@/utils/logger";
import { v4 as uuidv4 } from "uuid";

// Re-export all functions from the modules
import { ensureBucketExists, getFilesFromFolder, deleteFileFromStorage } from "./storage/storageUtils";
import { uploadProfileImage, updateArtistProfileImage } from "./profile/profileImageAPI";
import { uploadArtwork, updateArtistBackgroundImage } from "./artwork/artworkAPI";

/**
 * Generic upload image function that determines whether to upload a profile image or artwork
 */
export const uploadImage = async (file: File, artistName: string, isProfileImage: boolean = true): Promise<string | null> => {
  try {
    logger.info(`Uploading ${isProfileImage ? 'profile image' : 'artwork'} for artist: ${artistName}`);
    
    // Call the appropriate function based on the image type
    if (isProfileImage) {
      return await uploadProfileImage(file, artistName);
    } else {
      return await uploadArtwork(file, artistName);
    }
  } catch (error) {
    logger.error("Error in uploadImage:", error);
    return null;
  }
};

// Export all the functions from the other modules to maintain the same API
export {
  ensureBucketExists,
  getFilesFromFolder,
  deleteFileFromStorage,
  updateArtistProfileImage,
  updateArtistBackgroundImage
};
