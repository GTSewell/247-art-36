import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import ArtistReturnButton from '../artists/ArtistReturnButton';
import { ColorTheme } from '@/utils/colorExtraction';

interface DesktopLayoutProps {
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: Record<string, string>;
  artworks: string[];
  colorTheme: ColorTheme;
  onBack?: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    <div className="min-h-screen grid grid-cols-12" style={{ backgroundColor: colorTheme.background }}>
      <div className="col-span-12 p-4">
        <ArtistReturnButton 
          textColor={colorTheme.text} 
          onClick={onBack}
        />
      </div>
      
      <ArtistProfileLeftPanel
        artist={artist}
        profile={profile}
        colorTheme={colorTheme}
      />
      <ArtistProfileCenterPanel
        artist={artist}
        profile={profile}
        techniques={techniques}
        styles={styles}
        artworks={artworks}
        colorTheme={colorTheme}
      />
      <ArtistProfileRightPanel
        artist={artist}
        profile={profile}
        socialPlatforms={socialPlatforms}
        colorTheme={colorTheme}
      />
    </div>
  );
};

export default DesktopLayout;
