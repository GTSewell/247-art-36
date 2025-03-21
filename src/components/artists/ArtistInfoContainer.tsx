
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArtistBio from './ArtistBio';
import ArtistTechniquesStyles from './ArtistTechniquesStyles';
import ArtistSocialLinks from './ArtistSocialLinks';
import { Artist } from '@/data/types/artist';
import { ArtistArtworksView } from './ArtistArtworksView';

interface ArtistInfoContainerProps {
  bio: string;
  techniques: string[];
  styles: string[];
  socialPlatforms: string[];
  isMobile: boolean;
  isModalView?: boolean;
  modalTextClass?: string;
  artist?: Artist;
  colorTheme?: {
    badgeBg?: string;
    button?: string;
    buttonTextColor?: string;
    buttonHoverColor?: string;
  };
}

const ArtistInfoContainer: React.FC<ArtistInfoContainerProps> = ({ 
  bio, 
  techniques, 
  styles, 
  socialPlatforms, 
  isMobile, 
  isModalView = false,
  modalTextClass = "",
  artist,
  colorTheme 
}) => {
  // Calculate appropriate height
  const getScrollHeight = () => {
    if (isMobile) {
      return 'calc(100vh - 350px)';
    } else if (isModalView) {
      return 'calc(70vh - 180px)';
    } else {
      return 'calc(80vh - 180px)';
    }
  };

  // If in desktop modal view, only show artworks
  if (isModalView && !isMobile) {
    return (
      <ScrollArea 
        className={`flex-grow overflow-y-auto pr-3 mb-4 w-full min-w-0 ${modalTextClass}`}
        style={{ 
          height: getScrollHeight(),
          minHeight: isMobile ? '300px' : isModalView ? '280px' : 'auto',
          maxHeight: isMobile ? '400px' : isModalView ? '350px' : undefined,
          maxWidth: '100%'
        }}
      >
        {artist && (
          <ArtistArtworksView
            artist={artist}
            isGeneratingArtworks={false}
            setIsGeneratingArtworks={() => {}}
            artworkErrors={{}}
            handleArtworkImageError={() => {}}
          />
        )}
      </ScrollArea>
    );
  }

  // For mobile or non-modal views, show the original content
  return (
    <ScrollArea 
      className={`flex-grow overflow-y-auto pr-3 mb-4 w-full min-w-0 ${modalTextClass}`}
      style={{ 
        height: getScrollHeight(),
        minHeight: isMobile ? '300px' : isModalView ? '280px' : 'auto',
        maxHeight: isMobile ? '400px' : isModalView ? '350px' : undefined,
        maxWidth: '100%'
      }}
    >
      <div className="space-y-4 pb-6 w-full max-w-full overflow-hidden min-w-0">
        <ArtistBio 
          bio={bio} 
          isMobile={isMobile}
          useAccordion={isModalView && !isMobile}
        />

        <ArtistTechniquesStyles 
          techniques={techniques} 
          styles={styles} 
          badgeBgColor={colorTheme?.badgeBg}
          useAccordion={false}
        />

        <ArtistSocialLinks 
          socialPlatforms={socialPlatforms} 
          buttonColor={colorTheme?.button}
          buttonTextColor={colorTheme?.buttonTextColor}
          buttonHoverColor={colorTheme?.buttonHoverColor}
          useAccordion={false}
          artist={artist}
        />
      </div>
    </ScrollArea>
  );
};

export default ArtistInfoContainer;
