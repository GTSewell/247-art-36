import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import MobileNavigation from './MobileNavigation';
import MobilePanel from './MobilePanel';
import MobileCarousel from './MobileCarousel';
import { ColorTheme } from '@/utils/colorExtraction';

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
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colorTheme.background }}>
      <MobileNavigation 
        name={artist.name} 
        backgroundColor={colorTheme.header} 
        textColor={colorTheme.text}
        onBack={onBack}
      />
      
      <div className="flex-grow overflow-y-auto">
        <MobilePanel 
          artist={artist}
          profile={profile}
          techniques={techniques}
          styles={styles}
          socialPlatforms={socialPlatforms}
          colorTheme={colorTheme}
        />
        <MobileCarousel 
          artworks={artworks}
          colorTheme={colorTheme}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
