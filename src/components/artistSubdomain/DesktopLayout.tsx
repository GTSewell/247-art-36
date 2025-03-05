
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks,
  colorTheme
}) => {
  const navigate = useNavigate();

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-8 overflow-hidden"
      style={{ 
        backgroundColor: colorTheme.background,
        backgroundImage: profile?.background_image ? `url(${profile.background_image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
      }}
    >
      <div className="container mx-auto">
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleReturnToArtists}
            className="bg-white/80 hover:bg-white backdrop-blur-sm"
          >
            <ArrowLeftCircle size={20} />
            <span className="sr-only">Return to Artists</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
            <ArtistProfileLeftPanel 
              artist={artist} 
              techniques={techniques}
              styles={styles}
              panelColor={colorTheme.panel}
              badgeBgColor={colorTheme.badgeBg}
            />
          </div>
          
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
          
          <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
            <ArtistProfileRightPanel 
              artist={artist}
              artworks={artworks}
              panelColor={colorTheme.panel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
