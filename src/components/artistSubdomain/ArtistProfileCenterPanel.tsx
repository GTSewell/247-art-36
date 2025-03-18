
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistLink } from '@/data/types/artistProfile';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import ArtistMobileHeader from './ArtistMobileHeader';
import ArtistConnectSection from './ArtistConnectSection';
import ArtistLinkButtons from './ArtistLinkButtons';

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
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      <ScrollArea className="h-full pr-4">
        <div className="space-y-6 pb-6">
          {/* Artist Profile Header - Only show on mobile/PWA */}
          {isMobile && <ArtistMobileHeader artist={artist} />}

          {/* Connect Section */}
          <ArtistConnectSection 
            artist={artist}
            socialPlatforms={socialPlatforms}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            buttonHoverColor={buttonHoverColor}
            buttonBorderColor={buttonBorderColor}
          />

          {/* Link Buttons */}
          <ArtistLinkButtons 
            links={links}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            buttonHoverColor={buttonHoverColor}
            buttonBorderColor={buttonBorderColor}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtistProfileCenterPanel;
