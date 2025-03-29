
import { logger } from "@/utils/logger";

export const formatSocialPlatforms = (artistData: any): string[] => {
  if (!artistData || !artistData.social_platforms) {
    return [""];
  }
  
  try {
    // If social_platforms is a string, try to parse it as JSON
    if (typeof artistData.social_platforms === 'string') {
      try {
        const parsed = JSON.parse(artistData.social_platforms);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
      } catch (e) {
        logger.error("Error parsing social_platforms string:", e);
        return [""];
      }
    }
    
    // If social_platforms is already an array, return it
    if (Array.isArray(artistData.social_platforms)) {
      return artistData.social_platforms.length > 0 ? artistData.social_platforms : [""];
    }
    
    // If social_platforms is an object, convert it to an array
    if (typeof artistData.social_platforms === 'object' && artistData.social_platforms !== null) {
      const platforms = Object.values(artistData.social_platforms);
      return platforms.length > 0 ? platforms.map(p => p?.toString() || "") : [""];
    }
  } catch (error) {
    logger.error("Error formatting social platforms:", error);
  }
  
  // Default fallback
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
