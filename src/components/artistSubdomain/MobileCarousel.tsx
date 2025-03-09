
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import MobilePanel from './MobilePanel';

interface ColorTheme {
  background: string;
  header: string;
  panel: string;
  text: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
}

interface MobileCarouselProps {
  emblaRef: React.RefObject<HTMLDivElement>;
  emblaApi: any;
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: Record<string, string>;
  artworks: string[];
  panelHeight: string;
  colorTheme: ColorTheme;
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({
  emblaRef,
  emblaApi,
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
  const linksArray = safeProfile?.links ? 
    (typeof safeProfile.links === 'string' ? 
      JSON.parse(safeProfile.links) : 
      safeProfile.links) : 
    [];

  // Define panel data
  const panels = [
    {
      id: 'info',
      title: 'Info',
      content: (
        <MobilePanel
          key="info"
          title="Artist Info"
          artist={safeArtist}
          profile={safeProfile}
          techniques={safeTechniques}
          styles={safeStyles}
          socialPlatforms={safeSocialPlatforms}
          links={linksArray}
          panelColor={colorTheme.panel}
          buttonColor={colorTheme.button}
          buttonTextColor={colorTheme.buttonText}
          buttonHoverColor={colorTheme.buttonHover}
          buttonBorderColor={colorTheme.buttonBorder}
          badgeBgColor={colorTheme.badgeBg}
          height={panelHeight}
          type="info"
        />
      )
    },
    {
      id: 'artworks',
      title: 'Artworks',
      content: (
        <MobilePanel
          key="artworks"
          title="Artworks"
          artist={safeArtist}
          artworks={safeArtworks}
          panelColor={colorTheme.panel}
          height={panelHeight}
          type="artworks"
        />
      )
    }
  ];

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container flex">
        {panels.map((panel) => (
          <div key={panel.id} className="embla__slide flex-shrink-0 w-full">
            {panel.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
