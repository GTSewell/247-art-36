
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import ArtistReturnButton from '../artists/ArtistReturnButton';

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
  // Safe handling of potentially undefined/null values
  const safeArtist = artist || {} as Artist;
  const safeProfile = profile || null;
  const safeTechniques = techniques || [];
  const safeStyles = styles || [];
  const safeSocialPlatforms = typeof socialPlatforms === 'object' ? socialPlatforms : {};
  const safeArtworks = artworks || [];
  
  return (
    <div className="min-h-screen grid grid-cols-12" style={{ backgroundColor: colorTheme.background }}>
      <div className="col-span-12 p-4">
        <ArtistReturnButton 
          textColor={colorTheme.text} 
          onClick={onBack}
        />
      </div>
      
      <ArtistProfileLeftPanel
        artist={safeArtist}
        techniques={safeTechniques}
        styles={safeStyles}
        panelColor={colorTheme.panel}
        badgeBgColor={colorTheme.badgeBg}
      />
      <ArtistProfileCenterPanel
        artist={safeArtist}
        links={safeProfile?.links || []}
        socialPlatforms={safeSocialPlatforms}
        panelColor={colorTheme.panel}
        buttonColor={colorTheme.button}
        buttonTextColor={colorTheme.buttonText}
        buttonHoverColor={colorTheme.buttonHover}
        buttonBorderColor={colorTheme.buttonBorder}
      />
      <ArtistProfileRightPanel
        artist={safeArtist}
        artworks={safeArtworks}
        panelColor={colorTheme.panel}
      />
    </div>
  );
};

export default DesktopLayout;
