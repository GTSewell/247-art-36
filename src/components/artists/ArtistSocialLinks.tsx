
import React, { useState } from 'react';
import { normalizeSocialPlatforms, getSocialIcon } from '@/components/artistSubdomain/utils/socialPlatformUtils.tsx';
import { Zap } from 'lucide-react';
import ArtistMessageModal from '@/components/artistSubdomain/ArtistMessageModal';
import { Artist } from '@/data/types/artist';

interface ArtistSocialLinksProps {
  socialPlatforms: string[];
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  useAccordion?: boolean;
  artist?: Artist;
}

const ArtistSocialLinks: React.FC<ArtistSocialLinksProps> = ({
  socialPlatforms,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  useAccordion = false,
  artist
}) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // Normalize social platform data using the shared utility
  const normalizedPlatforms = normalizeSocialPlatforms(socialPlatforms);
  
  if (normalizedPlatforms.length === 0 && !artist) {
    return null;
  }
  
  const buttonStyle = buttonColor ? {
    backgroundColor: buttonColor,
    color: buttonTextColor || 'currentColor'
  } : {};
  
  return (
    <div className="mb-4 py-0 px-0 my-[7px]">
      <h3 className="font-bold text-base mb-2">Social Media</h3>
      <div className="flex flex-wrap gap-3">
        {normalizedPlatforms.map((platform, index) => {
          return (
            <a 
              key={index} 
              href={platform.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full" 
              style={buttonStyle}
              onMouseOver={e => {
                if (buttonHoverColor) {
                  e.currentTarget.style.backgroundColor = buttonHoverColor;
                }
              }} 
              onMouseOut={e => {
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
        
        {artist && (
          <>
            <button
              onClick={() => setMessageModalOpen(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full border border-gray-200"
              style={buttonStyle}
              onMouseOver={e => {
                if (buttonHoverColor) {
                  e.currentTarget.style.backgroundColor = buttonHoverColor;
                }
              }}
              onMouseOut={e => {
                if (buttonColor) {
                  e.currentTarget.style.backgroundColor = buttonColor;
                }
              }}
            >
              <Zap size={16} />
            </button>
            
            <ArtistMessageModal 
              open={messageModalOpen} 
              onOpenChange={setMessageModalOpen} 
              artist={artist}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistSocialLinks;
