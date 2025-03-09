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
  const getSocialIcon = (platform: string) => {
    let platformName = platform.toLowerCase();
    
    if (platformName.includes('instagram')) platformName = 'instagram';
    else if (platformName.includes('twitter') || platformName.includes('x.com')) platformName = 'twitter';
    else if (platformName.includes('facebook')) platformName = 'facebook';
    else if (platformName.includes('linkedin')) platformName = 'linkedin';
    else if (platformName.includes('youtube')) platformName = 'youtube';
    
    switch (platformName) {
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
  
  const getSocialUrl = (platform: string) => {
    if (platform.startsWith('http://') || platform.startsWith('https://')) {
      return platform;
    }
    
    if (platform.toLowerCase().includes('instagram')) {
      return `https://instagram.com/${platform.replace('@', '')}`;
    } else if (platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x.com')) {
      return `https://twitter.com/${platform.replace('@', '')}`;
    } else if (platform.toLowerCase().includes('facebook')) {
      return `https://facebook.com/${platform}`;
    } else if (platform.toLowerCase().includes('linkedin')) {
      return `https://linkedin.com/in/${platform}`;
    } else if (platform.toLowerCase().includes('youtube')) {
      return `https://youtube.com/${platform}`;
    }
    
    return `https://${platform}`;
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
        {socialPlatforms.map((platform: string, index: number) => {
          return (
            <a
              key={index}
              href={getSocialUrl(platform)}
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
              aria-label={`Visit ${platform}`}
            >
              {getSocialIcon(platform)}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistSocialLinks;
