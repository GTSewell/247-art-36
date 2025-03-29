
import { ensureArray } from "@/utils/ensureArray";
import { logger } from "@/utils/logger";

/**
 * Format social platforms from database format to form format
 */
export const formatSocialPlatforms = (artist: any): string[] => {
  if (!artist || !artist.social_platforms) {
    logger.info("No social platforms found, returning empty array");
    return [""];
  }

  try {
    // Use ensureArray to handle different formats
    const platforms = ensureArray(artist.social_platforms);
    
    // Return empty array with one empty string if no platforms
    if (platforms.length === 0) {
      return [""];
    }
    
    return platforms;
  } catch (error) {
    logger.error("Error formatting social platforms:", error);
    return [""];
  }
};

/**
 * Process social platforms from form format to database format
 */
export const processSocialPlatforms = (platforms: string[]): string[] => {
  if (!platforms || platforms.length === 0) {
    return [];
  }
  
  // Filter out empty strings and trim whitespace
  return platforms
    .map(platform => platform.trim())
    .filter(platform => platform.length > 0);
};
