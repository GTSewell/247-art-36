
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
import { Button } from '@/components/ui/button';

interface ArtistConnectSectionProps {
  socialPlatforms: string[];
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const ArtistConnectSection: React.FC<ArtistConnectSectionProps> = ({
  socialPlatforms,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  // Skip if no social platforms
  if (!socialPlatforms || socialPlatforms.length === 0) {
    return null;
  }

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
      
      return { type, url, original: trimmed };
    } catch (error) {
      console.error("Invalid URL format:", url);
      return { type: 'external', url, original: trimmed };
    }
  });

  // Get icon based on platform type
  const getLinkIcon = (type: string) => {
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
      default:
        return <ExternalLink />;
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">CONNECT</h3>
      <div className="flex gap-2 flex-wrap">
        {normalizedPlatforms.map((platform, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
              borderColor: buttonBorderColor,
            }}
            onClick={() => window.open(platform.url, '_blank')}
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
          >
            {getLinkIcon(platform.type)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ArtistConnectSection;
