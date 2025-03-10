
/**
 * Utility functions for handling artist social platforms
 */

/**
 * Process social platforms string into a formatted array
 */
export const processSocialPlatforms = (platforms: string): string[] => {
  if (!platforms) return [];
  
  return platforms.split(',')
    .map(platform => platform.trim())
    .filter(platform => platform) // Remove empty strings
    .map(platform => {
      // Clean up formats to prevent duplications
      if (platform.includes('instagram.com/instagram.com/')) {
        return platform.replace('instagram.com/instagram.com/', 'instagram.com/');
      }
      if (platform.includes('twitter.com/twitter.com/') || platform.includes('x.com/x.com/')) {
        return platform.replace(/(?:twitter\.com\/twitter\.com\/|x\.com\/x\.com\/)/, 'twitter.com/');
      }
      
      // Ensure @ handles are properly formatted
      if (platform.startsWith('@') && !platform.includes('.com')) {
        return platform; // Keep as is, will be processed when displayed
      }
      
      // Add https:// protocol if not present and not an @ handle
      if (!platform.startsWith('http://') && !platform.startsWith('https://') && !platform.startsWith('@')) {
        return `https://${platform}`;
      }
      
      return platform;
    });
};

/**
 * Formats social platforms to prevent duplication
 */
export const formatSocialPlatforms = (data: any): string => {
  let formattedSocialPlatforms = "";
  
  if (Array.isArray(data.social_platforms)) {
    formattedSocialPlatforms = data.social_platforms
      .map((platform: string) => {
        // Clean up formats to prevent duplications
        if (platform.includes('instagram.com/instagram.com/')) {
          return platform.replace('instagram.com/instagram.com/', 'instagram.com/');
        }
        if (platform.includes('twitter.com/twitter.com/') || platform.includes('x.com/x.com/')) {
          return platform.replace(/(?:twitter\.com\/twitter\.com\/|x\.com\/x\.com\/)/, 'twitter.com/');
        }
        return platform;
      })
      .join(', ');
  } else if (typeof data.social_platforms === 'string') {
    formattedSocialPlatforms = data.social_platforms;
  }
  
  return formattedSocialPlatforms;
};
