
/**
 * Process social platforms from form data to database format
 */
export const processSocialPlatforms = (socialPlatformsString: string): string[] => {
  if (!socialPlatformsString) return [];
  
  // Split the string by comma and trim each item
  return socialPlatformsString
    .split(',')
    .map(platform => platform.trim())
    .filter(platform => platform !== ''); // Filter out empty strings
};

/**
 * Format social platforms from database to form data format
 */
export const formatSocialPlatforms = (artistData: any): string => {
  if (!artistData || !artistData.social_platforms) return '';
  
  // Check if social_platforms is an array
  if (Array.isArray(artistData.social_platforms)) {
    return artistData.social_platforms.join(', ');
  }
  
  // If it's a string, return it directly
  if (typeof artistData.social_platforms === 'string') {
    return artistData.social_platforms;
  }
  
  // If it's an object or something else, convert to string
  return JSON.stringify(artistData.social_platforms);
};
