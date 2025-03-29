
import { logger } from "@/utils/logger";

export const formatSocialPlatforms = (artistData: any): string[] => {
  if (!artistData || !artistData.social_platforms) {
    logger.info("No social platforms data found, returning empty array");
    return [""];
  }
  
  try {
    // If social_platforms is a string, try to parse it as JSON
    if (typeof artistData.social_platforms === 'string') {
      try {
        const parsed = JSON.parse(artistData.social_platforms);
        const result = Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
        logger.info("Parsed social platforms from string:", result);
        return result;
      } catch (e) {
        logger.error("Error parsing social_platforms string:", e);
        return [""];
      }
    }
    
    // If social_platforms is already an array, return it
    if (Array.isArray(artistData.social_platforms)) {
      const result = artistData.social_platforms.length > 0 ? 
        artistData.social_platforms.map(p => p?.toString() || "") : 
        [""];
      logger.info("Social platforms from array:", result);
      return result;
    }
    
    // If social_platforms is an object, convert it to an array
    if (typeof artistData.social_platforms === 'object' && artistData.social_platforms !== null) {
      const platforms = Object.values(artistData.social_platforms);
      const result = platforms.length > 0 ? 
        platforms.map(p => p?.toString() || "") : 
        [""];
      logger.info("Social platforms from object:", result);
      return result;
    }
  } catch (error) {
    logger.error("Error formatting social platforms:", error);
  }
  
  // Default fallback
  logger.info("Using default empty social platforms array");
  return [""];
};

export const processSocialPlatforms = (platforms: string[]): string[] => {
  // Filter out empty platforms and trim whitespace
  const processed = platforms
    .filter(platform => platform.trim() !== "")
    .map(platform => platform.trim());
    
  logger.info("Processed social platforms:", processed);
  
  // If all platforms were empty, return an empty array
  return processed.length > 0 ? processed : [];
};
