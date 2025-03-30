
import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const socialIcons = {
  Facebook: <Facebook className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  Twitter: <Twitter className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
};

interface ArtistSocialSectionProps {
  socialPlatforms?: string[];
  isMobile?: boolean;
}

const ArtistSocialSection: React.FC<ArtistSocialSectionProps> = ({ 
  socialPlatforms,
  isMobile = false 
}) => {
  if (!socialPlatforms || socialPlatforms.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Social Media</h3>
      <div className="flex gap-4">
        {socialPlatforms.map((platform) => (
          <button
            key={platform}
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              console.log(`Opening ${platform} profile`);
            }}
          >
            {socialIcons[platform as keyof typeof socialIcons]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtistSocialSection;
