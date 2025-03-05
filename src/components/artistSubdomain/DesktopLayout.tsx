
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';

interface DesktopLayoutProps {
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: string[];
  artworks: string[];
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks
}) => {
  const backgroundColor = profile?.background_color || '#f7cf1e';
  const panelColor = profile?.panel_color || '#ffffff';
  const textColor = profile?.text_color || '#000000';
  const accentColor = profile?.accent_color || '#ef3f36';

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-8 overflow-hidden"
      style={{ 
        backgroundColor: backgroundColor,
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <ArtistProfileLeftPanel 
              artist={artist} 
              techniques={techniques}
              styles={styles}
              panelColor={panelColor}
              textColor={textColor}
              accentColor={accentColor}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <ArtistProfileCenterPanel 
              artist={artist}
              socialPlatforms={socialPlatforms}
              links={profile?.links || []}
              panelColor={panelColor}
              textColor={textColor}
              accentColor={accentColor}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <ArtistProfileRightPanel 
              artist={artist}
              artworks={artworks}
              panelColor={panelColor}
              textColor={textColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
