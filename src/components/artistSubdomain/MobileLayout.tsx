
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

const MobileLayout: React.FC<MobileLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks,
  colorTheme
}) => {
  return (
    <div 
      className="flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: colorTheme.background,
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
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
                <ArtistProfileLeftPanel 
                  artist={artist} 
                  techniques={techniques}
                  styles={styles}
                  panelColor={colorTheme.panel}
                  badgeBgColor={colorTheme.badgeBg}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="links" className="mt-0 h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
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
              </div>
            </TabsContent>
            
            <TabsContent value="artwork" className="mt-0 h-full">
              <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
                <ArtistProfileRightPanel 
                  artist={artist}
                  artworks={artworks}
                  panelColor={colorTheme.panel}
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
