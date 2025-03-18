
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { normalizeSocialPlatforms, getSocialIcon } from './utils/socialPlatformUtils.tsx';
import { MessageSquare } from 'lucide-react';
import ArtistMessageModal from './ArtistMessageModal';
import { Artist } from '@/data/types/artist';

interface ArtistConnectSectionProps {
  artist: Artist;
  socialPlatforms: string[];
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const ArtistConnectSection: React.FC<ArtistConnectSectionProps> = ({
  artist,
  socialPlatforms,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  
  // Skip if no social platforms and no artist
  if ((!socialPlatforms || socialPlatforms.length === 0) && !artist) {
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
        
        {/* 247 Messaging Button */}
        <Button
          variant="outline"
          className="rounded-md px-3 h-9 flex items-center gap-1"
          style={{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            borderColor: buttonBorderColor,
          }}
          onClick={() => setMessageModalOpen(true)}
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
          <MessageSquare className="h-4 w-4 mr-1" />
          247 Messaging
        </Button>
      </div>
      
      {/* Message Modal */}
      <ArtistMessageModal 
        open={messageModalOpen} 
        onOpenChange={setMessageModalOpen} 
        artist={artist}
      />
    </div>
  );
};

export default ArtistConnectSection;
