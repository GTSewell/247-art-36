
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
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-8 overflow-hidden"
      style={{ 
        backgroundColor: profile?.background_color || '#f7cf1e',
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileLeftPanel 
              artist={artist} 
              techniques={techniques}
              styles={styles}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileCenterPanel 
              artist={artist}
              socialPlatforms={socialPlatforms}
              links={profile?.links || []}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
            <ArtistProfileRightPanel 
              artist={artist}
              artworks={artworks}
              panelColor={profile?.panel_color || '#ffffff'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
