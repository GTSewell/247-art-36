
import React from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

interface ArtistSocialLinksProps {
  socialPlatforms: string[];
}

const ArtistSocialLinks: React.FC<ArtistSocialLinksProps> = ({ socialPlatforms }) => {
  const socialIcons = {
    facebook: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
  };

  if (!socialPlatforms || socialPlatforms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 mb-1">
      <h3 className="font-semibold text-gray-800 text-sm">Social Media</h3>
      <div className="flex gap-3">
        {socialPlatforms.map((platform: string) => {
          const platformKey = platform.toLowerCase() as keyof typeof socialIcons;
          return (
            <button
              key={platform}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {socialIcons[platformKey] || <span>{platform}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistSocialLinks;
