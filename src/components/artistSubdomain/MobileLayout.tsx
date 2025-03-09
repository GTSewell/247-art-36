
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import MobileNavigation from './MobileNavigation';
import MobilePanel from './MobilePanel';
import useEmblaCarousel from 'embla-carousel-react';
import MobileCarousel from './MobileCarousel';
import { logger } from '@/utils/logger';

// Correctly define the ColorTheme interface with all required properties
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

interface MobileLayoutProps {
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: Record<string, string>;
  artworks: string[];
  colorTheme: ColorTheme;
  onBack?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks,
  colorTheme,
  onBack
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [panelHeight, setPanelHeight] = useState('calc(100vh - 4rem)');
  
  // Safe handling of potentially undefined/null values
  const safeArtist = artist || {} as Artist;
  const safeProfile = profile || null;
  const safeTechniques = techniques || [];
  const safeStyles = styles || [];
  const safeSocialPlatforms = typeof socialPlatforms === 'object' ? socialPlatforms : {};
  const safeArtworks = artworks || [];

  useEffect(() => {
    const handleResize = () => {
      setPanelHeight(`calc(100vh - 4rem)`);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Log the artist data to help diagnose issues
    logger.info(`MobileLayout loaded for artist: ${safeArtist.name}, ID: ${safeArtist.id}`);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [safeArtist]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorTheme.background }}>
      <MobileNavigation 
        name={safeArtist.name || 'Artist'} 
        backgroundColor={colorTheme.header} 
        textColor={colorTheme.text}
        onBack={onBack}
      />
      
      <div className="flex-grow overflow-hidden">
        <MobileCarousel 
          emblaApi={emblaApi}
          emblaRef={emblaRef}
          artist={safeArtist}
          profile={safeProfile}
          techniques={safeTechniques}
          styles={safeStyles}
          socialPlatforms={safeSocialPlatforms}
          artworks={safeArtworks}
          panelHeight={panelHeight}
          colorTheme={colorTheme}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
