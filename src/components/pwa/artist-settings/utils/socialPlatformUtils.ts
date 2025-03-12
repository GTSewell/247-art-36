
import { SocialPlatform } from "../types";

/**
 * Utility functions for handling artist social platforms
 */

/**
 * Process social platforms for saving to database
 */
export const processSocialPlatforms = (platforms: SocialPlatform[]): string[] => {
  if (!platforms || !platforms.length) return [];
  
  return platforms.map(platform => {
    const { platform: platformName, username } = platform;
    let formattedPlatform = '';
    
    // Handle different platform formats
    if (platformName === 'instagram') {
      formattedPlatform = `instagram.com/${username}`;
    } else if (platformName === 'twitter' || platformName === 'x') {
      formattedPlatform = `twitter.com/${username}`;
    } else if (platformName === 'facebook') {
      formattedPlatform = `facebook.com/${username}`;
    } else {
      // Generic format for other platforms
      formattedPlatform = `${platformName}.com/${username}`;
    }
    
    // Clean up formats to prevent duplications
    if (formattedPlatform.includes('instagram.com/instagram.com/')) {
      return formattedPlatform.replace('instagram.com/instagram.com/', 'instagram.com/');
    }
    if (formattedPlatform.includes('twitter.com/twitter.com/') || formattedPlatform.includes('x.com/x.com/')) {
      return formattedPlatform.replace(/(?:twitter\.com\/twitter\.com\/|x\.com\/x\.com\/)/, 'twitter.com/');
    }
    
    // Add https:// protocol if not present
    if (!formattedPlatform.startsWith('http://') && !formattedPlatform.startsWith('https://')) {
      return `https://${formattedPlatform}`;
    }
    
    return formattedPlatform;
  });
};

/**
 * Parse social platform strings from database to SocialPlatform objects
 */
export const parseSocialPlatforms = (platformStrings: string[]): SocialPlatform[] => {
  if (!platformStrings || !platformStrings.length) return [];
  
  return platformStrings.map(url => {
    // Remove protocol
    let cleanUrl = url.replace(/^https?:\/\//, '');
    
    // Extract platform and username
    let platform = '';
    let username = '';
    
    if (cleanUrl.includes('instagram.com/')) {
      platform = 'instagram';
      username = cleanUrl.split('instagram.com/')[1];
    } else if (cleanUrl.includes('twitter.com/')) {
      platform = 'twitter';
      username = cleanUrl.split('twitter.com/')[1];
    } else if (cleanUrl.includes('facebook.com/')) {
      platform = 'facebook';
      username = cleanUrl.split('facebook.com/')[1];
    } else {
      // Try to extract from generic format
      const parts = cleanUrl.split('.');
      if (parts.length > 1) {
        platform = parts[0];
        const subParts = cleanUrl.split('/');
        if (subParts.length > 1) {
          username = subParts[subParts.length - 1];
        }
      }
    }
    
    return { platform, username };
  });
};
