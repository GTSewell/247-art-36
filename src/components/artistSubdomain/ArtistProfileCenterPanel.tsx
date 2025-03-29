
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistLink } from '@/data/types/artistProfile';
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistLinkButtons from './ArtistLinkButtons';
import ArtistConnectSection from './ArtistConnectSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface ArtistProfileCenterPanelProps {
  artist: Artist;
  socialPlatforms: string[];
  links: ArtistLink[];
  panelColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonBorderColor: string;
}

const ArtistProfileCenterPanel: React.FC<ArtistProfileCenterPanelProps> = ({
  artist,
  socialPlatforms,
  links,
  panelColor,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonBorderColor
}) => {
  const isMobile = useIsMobile();
  
  // Filter out empty social platforms
  const validSocialPlatforms = socialPlatforms.filter(platform => 
    platform && typeof platform === 'string' && platform.trim() !== ''
  );

  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: panelColor }}
    >
      {!isMobile && (
        <div className="border-b border-gray-200 p-5 flex items-center">
          <div className="mr-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={artist.image || '/placeholder.svg'} 
                alt={artist.name || 'Artist'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{artist.name}</h2>
            <p className="text-gray-600">{artist.specialty}</p>
            <p className="text-sm text-gray-500">
              {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
            </p>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-grow overflow-auto">
        <div className="p-5">
          <ArtistConnectSection 
            artist={artist}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            buttonHoverColor={buttonHoverColor}
            buttonBorderColor={buttonBorderColor}
          />
          
          {links.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-bold mb-3">Links</h3>
              <ArtistLinkButtons 
                links={links}
                buttonColor={buttonColor}
                buttonTextColor={buttonTextColor}
                buttonHoverColor={buttonHoverColor}
                buttonBorderColor={buttonBorderColor}
              />
            </div>
          )}
          
          {validSocialPlatforms.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-bold mb-3">Social Media</h3>
              <div className="space-y-1">
                {validSocialPlatforms.map((platform, index) => (
                  <div key={index} className="p-2 rounded-md bg-gray-50">
                    {platform}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-base font-bold mb-3">About {artist.name}</h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {artist.bio || `No biography available for ${artist.name}.`}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
