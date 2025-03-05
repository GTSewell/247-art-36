
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';

interface MobileLayoutProps {
  artist: Artist;
  profile: ArtistProfile | null;
  techniques: string[];
  styles: string[];
  socialPlatforms: string[];
  artworks: string[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks
}) => {
  return (
    <div 
      className="flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: profile?.background_color || '#f7cf1e',
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%'
      }}
    >
      <div className="w-full h-[calc(100vh-2rem)] mx-4">
        <Tabs defaultValue="about" className="w-full h-full flex flex-col">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="artwork">Artwork</TabsTrigger>
          </TabsList>
          
          <div className="flex-grow overflow-hidden">
            <TabsContent value="about" className="mt-0 h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                <ArtistProfileLeftPanel 
                  artist={artist} 
                  techniques={techniques}
                  styles={styles}
                  panelColor={profile?.panel_color || '#ffffff'}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="links" className="mt-0 h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                <ArtistProfileCenterPanel 
                  artist={artist}
                  socialPlatforms={socialPlatforms}
                  links={profile?.links || []}
                  panelColor={profile?.panel_color || '#ffffff'}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="artwork" className="mt-0 h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: profile?.panel_color || '#ffffff' }}>
                <ArtistProfileRightPanel 
                  artist={artist}
                  artworks={artworks}
                  panelColor={profile?.panel_color || '#ffffff'}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileLayout;
