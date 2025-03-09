
import React from 'react';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import MobilePanel from './MobilePanel';
import { UseEmblaCarouselType } from 'embla-carousel-react';

interface MobileCarouselProps {
  emblaApi: UseEmblaCarouselType[1] | undefined; 
  emblaRef: React.RefCallback<HTMLDivElement>;
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: Record<string, string>;
  artworks: string[];
  panelHeight: string;
  colorTheme: {
    background: string;
    header: string;
    panel: string;
    text: string;
    button: string;
    buttonText: string;
    buttonHover: string;
    buttonBorder: string;
    badgeBg: string;
  };
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({
  emblaApi,
  emblaRef,
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks,
  panelHeight,
  colorTheme
}) => {
  // Safe handling of potentially undefined/null values
  const safeArtist = artist || {} as Artist;
  const safeProfile = profile || null;
  const safeTechniques = techniques || [];
  const safeStyles = styles || [];
  const safeSocialPlatforms = typeof socialPlatforms === 'object' ? socialPlatforms : {};
  const safeArtworks = artworks || [];
  
  // Convert the record to an array for links
  const linksArray = safeProfile?.links || [];

  return (
    <div className="h-full overflow-hidden">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="h-full flex">
          {/* About Panel */}
          <div className="h-full min-w-0 shrink-0 grow-0 basis-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileLeftPanel 
                artist={safeArtist}
                techniques={safeTechniques}
                styles={safeStyles}
                panelColor={colorTheme.panel}
                badgeBgColor={colorTheme.badgeBg}
              />
            </MobilePanel>
          </div>
          
          {/* Links Panel */}
          <div className="h-full min-w-0 shrink-0 grow-0 basis-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileCenterPanel 
                artist={safeArtist}
                socialPlatforms={safeSocialPlatforms}
                links={linksArray}
                panelColor={colorTheme.panel}
                buttonColor={colorTheme.button}
                buttonTextColor={colorTheme.buttonText}
                buttonHoverColor={colorTheme.buttonHover}
                buttonBorderColor={colorTheme.buttonBorder}
              />
            </MobilePanel>
          </div>
          
          {/* Artwork Panel */}
          <div className="h-full min-w-0 shrink-0 grow-0 basis-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileRightPanel 
                artist={safeArtist}
                artworks={safeArtworks}
                panelColor={colorTheme.panel}
              />
            </MobilePanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarousel;
