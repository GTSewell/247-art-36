
import React from 'react';
import { Button } from '@/components/ui/button';
import { normalizeSocialPlatforms, getSocialIcon } from './utils/socialPlatformUtils.tsx';

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

  // Normalize social platform data using the shared utility
  const normalizedPlatforms = normalizeSocialPlatforms(socialPlatforms);

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
            {getSocialIcon(platform.type)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ArtistConnectSection;
