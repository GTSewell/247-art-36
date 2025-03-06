
import React, { useEffect, useState } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import useEmblaCarousel from 'embla-carousel-react';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Sync embla carousel with tab selection
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      const tabs = ['about', 'links', 'artwork'];
      setActiveTab(tabs[selectedIndex]);
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Sync tab selection with embla carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    const tabs = ['about', 'links', 'artwork'];
    const index = tabs.indexOf(activeTab);
    if (index >= 0) {
      emblaApi.scrollTo(index);
    }
  }, [activeTab, emblaApi]);

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
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 flex-1">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="artwork">Artwork</TabsTrigger>
            </TabsList>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleReturnToArtists}
              className="ml-2 bg-white/80 hover:bg-white backdrop-blur-sm h-9 w-9"
            >
              <ArrowLeftCircle size={18} />
              <span className="sr-only">Return to Artists</span>
            </Button>
          </div>
          
          <div className="flex-grow overflow-hidden">
            {/* Embla carousel wrapper */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {/* About Panel */}
                <div className="flex-shrink-0 flex-grow-0 min-w-full h-full">
                  <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
                    <ArtistProfileLeftPanel 
                      artist={artist} 
                      techniques={techniques}
                      styles={styles}
                      panelColor={colorTheme.panel}
                      badgeBgColor={colorTheme.badgeBg}
                    />
                  </div>
                </div>
                
                {/* Links Panel */}
                <div className="flex-shrink-0 flex-grow-0 min-w-full h-full">
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
                </div>
                
                {/* Artwork Panel */}
                <div className="flex-shrink-0 flex-grow-0 min-w-full h-full">
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileLayout;
