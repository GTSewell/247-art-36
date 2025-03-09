
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, Link } from 'lucide-react';

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
  const socialIcons = {
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />
  };

  // Function to extract platform name from URL
  const getPlatformFromUrl = (url: string): keyof typeof socialIcons | null => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('facebook.com')) return 'facebook';
    if (lowerUrl.includes('instagram.com')) return 'instagram';
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
    if (lowerUrl.includes('linkedin.com')) return 'linkedin';
    return null;
  };

  // Function to ensure URL has https://
  const formatUrl = (url: string): string => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
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
          const isUrl = platform.includes('.');
          const platformKey = isUrl ? 
            getPlatformFromUrl(platform) : 
            platform.toLowerCase() as keyof typeof socialIcons;
          
          const linkUrl = isUrl ? formatUrl(platform) : `https://${platform}.com`;
          const icon = platformKey && socialIcons[platformKey] 
            ? socialIcons[platformKey] 
            : <Link className="h-5 w-5" />;

          return (
            <a
              key={index}
              href={linkUrl}
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
            >
              {icon}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistSocialLinks;
