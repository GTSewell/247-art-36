
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistLink } from '@/data/types/artistProfile';
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistLinkButtons from './ArtistLinkButtons';
import ArtistConnectSection from './ArtistConnectSection';
import { useIsMobile } from '@/hooks/use-mobile';
import ArtistMobileHeader from './ArtistMobileHeader';
import SampleLinksContainer from './links/SampleLinksContainer';

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
      <ScrollArea className="flex-grow overflow-auto">
        <div className="p-5">
          {/* Add the artist header for mobile view */}
          {isMobile && <ArtistMobileHeader artist={artist} />}
        
          {/* Connect section always appears first */}
          <h3 className="text-base font-bold mb-3">CONNECT</h3>
          <ArtistConnectSection 
            artist={artist}
            socialPlatforms={validSocialPlatforms}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            buttonHoverColor={buttonHoverColor}
            buttonBorderColor={buttonBorderColor}
          />
          
          {/* Show real links if available */}
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
          
          {/* Show sample links if no real links are available */}
          {links.length === 0 && (
            <SampleLinksContainer
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
              buttonHoverColor={buttonHoverColor}
              buttonBorderColor={buttonBorderColor}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
