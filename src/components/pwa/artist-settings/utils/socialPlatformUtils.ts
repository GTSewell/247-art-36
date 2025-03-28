
/**
 * Format social platforms from database format to form data format
 */
export const formatSocialPlatforms = (artistData: any): string[] => {
  if (!artistData || !artistData.social_platforms) return [""];
  
  // Check if social_platforms is already an array
  if (Array.isArray(artistData.social_platforms)) {
    return artistData.social_platforms.length > 0 
      ? artistData.social_platforms 
      : [""];
  }
  
  // If it's a string, split it
  if (typeof artistData.social_platforms === 'string') {
    return artistData.social_platforms
      .split(',')
      .map(platform => platform.trim())
      .filter(platform => platform !== '');
  }
  
  // Return empty array with one empty string as default
  return [""];
};

/**
 * Process social platforms from form data for database storage
 * Now accepts and returns string array directly
 */
export const processSocialPlatforms = (socialPlatforms: string[]): string[] => {
  if (!socialPlatforms) return [];
  
  // Filter out empty strings
  return socialPlatforms.filter(platform => platform.trim() !== '');
};
