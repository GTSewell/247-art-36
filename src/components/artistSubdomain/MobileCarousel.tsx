
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import MobilePanel from './MobilePanel';

interface MobileCarouselProps {
  emblaRef: React.RefObject<HTMLDivElement>;
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: string[];
  artworks: string[];
  panelHeight: string;
  colorTheme: {
    background: string;
    panel: string;
    button: string;
    buttonText: string;
    buttonHover: string;
    buttonBorder: string;
    badgeBg: string;
  };
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({
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
  return (
    <div ref={emblaRef} className="h-full">
      <Carousel className="h-full">
        <CarouselContent className="h-full">
          {/* About Panel */}
          <CarouselItem className="h-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileLeftPanel 
                artist={artist} 
                techniques={techniques}
                styles={styles}
                panelColor={colorTheme.panel}
                badgeBgColor={colorTheme.badgeBg}
              />
            </MobilePanel>
          </CarouselItem>
          
          {/* Links Panel */}
          <CarouselItem className="h-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileCenterPanel 
                artist={artist}
                socialPlatforms={socialPlatforms}
                links={profile?.links || []}
                panelColor={colorTheme.panel}
                buttonColor={colorTheme.button}
                buttonTextColor={colorTheme.buttonText}
                buttonHoverColor={colorTheme.buttonHover}
                buttonBorderColor={colorTheme.buttonBorder}
              />
            </MobilePanel>
          </CarouselItem>
          
          {/* Artwork Panel */}
          <CarouselItem className="h-full">
            <MobilePanel panelHeight={panelHeight} panelColor={colorTheme.panel}>
              <ArtistProfileRightPanel 
                artist={artist}
                artworks={artworks}
                panelColor={colorTheme.panel}
              />
            </MobilePanel>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MobileCarousel;
