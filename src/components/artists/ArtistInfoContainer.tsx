
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArtistBio from './ArtistBio';
import ArtistTechniquesStyles from './ArtistTechniquesStyles';
import ArtistSocialLinks from './ArtistSocialLinks';

interface ArtistInfoContainerProps {
  bio: string;
  techniques: string[];
  styles: string[];
  socialPlatforms: string[];
  isMobile: boolean;
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
  colorTheme 
}) => {
  return (
    <ScrollArea 
      className="flex-grow overflow-y-auto pr-3 mb-6 w-full" 
      style={{ 
        height: isMobile ? 'calc(100vh - 350px)' : 'calc(80vh - 180px)',
        minHeight: isMobile ? '300px' : 'auto',
        maxHeight: isMobile ? '400px' : undefined
      }}
    >
      <div className="space-y-6 pb-10 w-full max-w-full">
        <ArtistBio 
          bio={bio} 
          isMobile={isMobile} 
          useAccordion={false}
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
        />
      </div>
    </ScrollArea>
  );
};

export default ArtistInfoContainer;
