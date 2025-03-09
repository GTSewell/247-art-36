
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Youtube, ExternalLink } from 'lucide-react';

interface ArtistSocialLinksProps {
  socialPlatforms: string[];
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  useAccordion?: boolean;
}

const ArtistSocialLinks: React.FC<ArtistSocialLinksProps> = ({ 
  socialPlatforms,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  useAccordion = false
}) => {
  // Normalize social platform data to handle different formats
  const normalizedPlatforms = socialPlatforms.map((platform) => {
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
      }
      
      // Make sure the URL hasn't been duplicated (e.g., instagram.com/instagram.com/username)
      if (hostname.includes('instagram.com') && urlObj.pathname.includes('instagram.com/')) {
        const fixedPath = urlObj.pathname.replace('/instagram.com/', '/');
        url = `https://instagram.com${fixedPath}`;
      } else if ((hostname.includes('twitter.com') || hostname.includes('x.com')) && 
                 (urlObj.pathname.includes('twitter.com/') || urlObj.pathname.includes('x.com/'))) {
        const fixedPath = urlObj.pathname.replace(/\/(twitter\.com|x\.com)\//, '/');
        url = `https://twitter.com${fixedPath}`;
      }
    } catch (error) {
      console.error("Invalid URL format:", url);
    }
    
    return { type, url, original: trimmed };
  });
  
  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (!socialPlatforms || socialPlatforms.length === 0) {
    return null;
  }

  const buttonStyle = buttonColor ? {
    backgroundColor: buttonColor,
    color: buttonTextColor || 'currentColor',
  } : {};

  return (
    <div className="mb-4">
      <h3 className="font-bold text-base mb-2">Social Media</h3>
      <div className="flex gap-3">
        {normalizedPlatforms.map((platform, index) => {
          return (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full"
              style={buttonStyle}
              onMouseOver={(e) => {
                if (buttonHoverColor) {
                  e.currentTarget.style.backgroundColor = buttonHoverColor;
                }
              }}
              onMouseOut={(e) => {
                if (buttonColor) {
                  e.currentTarget.style.backgroundColor = buttonColor;
                }
              }}
              aria-label={`Visit ${platform.original}`}
            >
              {getSocialIcon(platform.type)}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistSocialLinks;
