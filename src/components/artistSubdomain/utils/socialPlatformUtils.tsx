
import React from 'react';
import { 
  Instagram,
  Twitter, 
  Facebook, 
  Youtube, 
  Dribbble, 
  Github, 
  Linkedin,
  ExternalLink
} from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';

export interface NormalizedPlatform {
  type: string;
  url: string;
  original: string;
}

/**
 * Normalizes social platform data to handle different formats
 */
export const normalizeSocialPlatforms = (socialPlatforms: string[]): NormalizedPlatform[] => {
  if (!socialPlatforms || socialPlatforms.length === 0) {
    return [];
  }

  return socialPlatforms.map((platform) => {
    // Trim the platform string
    const trimmed = platform.trim();
    
    // Handle @username format for social media
    if (trimmed.startsWith('@')) {
      const username = trimmed.substring(1);
      // Default to Instagram for @ handles, as that's the most common usage
      return { 
        type: 'instagram',
        url: `https://instagram.com/${username}`, 
        original: trimmed 
      };
    }
    
    // Extract platform type from URL or text
    let type = 'external';
    let url = trimmed;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If it doesn't have a protocol, add https://
      url = `https://${url}`;
    }
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Determine platform type from hostname
      if (hostname.includes('instagram')) {
        type = 'instagram';
      } else if (hostname.includes('twitter') || hostname.includes('x.com')) {
        type = 'twitter';
      } else if (hostname.includes('facebook')) {
        type = 'facebook';
      } else if (hostname.includes('linkedin')) {
        type = 'linkedin';
      } else if (hostname.includes('youtube')) {
        type = 'youtube';
      } else if (hostname.includes('github')) {
        type = 'github';
      } else if (hostname.includes('dribbble')) {
        type = 'dribbble';
      } else if (hostname.includes('tiktok')) {
        type = 'tiktok';
      }
      
      // Make sure the URL hasn't been duplicated
      if (hostname.includes('instagram.com') && urlObj.pathname.includes('instagram.com/')) {
        const fixedPath = urlObj.pathname.replace('/instagram.com/', '/');
        url = `https://instagram.com${fixedPath}`;
      } else if ((hostname.includes('twitter.com') || hostname.includes('x.com')) && 
                (urlObj.pathname.includes('twitter.com/') || urlObj.pathname.includes('x.com/'))) {
        const fixedPath = urlObj.pathname.replace(/\/(twitter\.com|x\.com)\//, '/');
        url = `https://twitter.com${fixedPath}`;
      } else if (hostname.includes('tiktok.com') && urlObj.pathname.includes('tiktok.com/')) {
        const fixedPath = urlObj.pathname.replace('/tiktok.com/', '/');
        url = `https://www.tiktok.com${fixedPath}`;
      }
      
      // Special handling for TikTok URLs to ensure they work properly
      if (type === 'tiktok') {
        // Ensure TikTok URLs have the www prefix
        if (!hostname.startsWith('www.')) {
          url = url.replace('https://tiktok.com', 'https://www.tiktok.com');
        }
        
        // Make sure @ is properly included for TikTok usernames
        if (urlObj.pathname.includes('/@')) {
          // URL already has proper format
        } else if (urlObj.pathname.startsWith('/')) {
          const username = urlObj.pathname.substring(1);
          if (username && !username.startsWith('@')) {
            url = `https://www.tiktok.com/@${username}`;
          }
        }
      }
      
      return { type, url, original: trimmed };
    } catch (error) {
      console.error("Invalid URL format:", url);
      return { type: 'external', url, original: trimmed };
    }
  });
};

/**
 * Get social media icon based on platform type
 */
export const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return <Instagram />;
    case 'twitter':
      return <Twitter />;
    case 'facebook':
      return <Facebook />;
    case 'youtube':
      return <Youtube />;
    case 'dribbble':
      return <Dribbble />;
    case 'github':
      return <Github />;
    case 'linkedin':
      return <Linkedin />;
    case 'tiktok':
      return <TikTokIcon />;
    default:
      return <ExternalLink />;
  }
};
