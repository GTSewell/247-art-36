
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArtistProfileLeftPanel from './ArtistProfileLeftPanel';
import ArtistProfileCenterPanel from './ArtistProfileCenterPanel';
import ArtistProfileRightPanel from './ArtistProfileRightPanel';
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

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
  const [activeTab, setActiveTab] = React.useState("about");

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Handle tab change when swiping
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle carousel change to update tab state
  const handleCarouselChange = (index: number) => {
    const tabs = ["about", "links", "artwork"];
    setActiveTab(tabs[index]);
  };

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
          onValueChange={handleTabChange} 
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 flex-1">
              <TabsTrigger value="about" onClick={() => handleTabChange("about")}>About</TabsTrigger>
              <TabsTrigger value="links" onClick={() => handleTabChange("links")}>Links</TabsTrigger>
              <TabsTrigger value="artwork" onClick={() => handleTabChange("artwork")}>Artwork</TabsTrigger>
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
            <Carousel 
              className="h-full" 
              opts={{
                align: "start",
                loop: true,
              }}
              onSlideChange={(_, api) => {
                const currentSlide = api.selectedScrollSnap();
                handleCarouselChange(currentSlide);
              }}
              value={{
                about: 0,
                links: 1,
                artwork: 2
              }[activeTab]}
            >
              <CarouselContent className="h-full">
                <CarouselItem className="h-full">
                  <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
                    <ArtistProfileLeftPanel 
                      artist={artist} 
                      techniques={techniques}
                      styles={styles}
                      panelColor={colorTheme.panel}
                      badgeBgColor={colorTheme.badgeBg}
                    />
                  </div>
                </CarouselItem>
                
                <CarouselItem className="h-full">
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
                </CarouselItem>
                
                <CarouselItem className="h-full">
                  <div className="rounded-lg overflow-hidden shadow-lg h-full" style={{ backgroundColor: colorTheme.panel }}>
                    <ArtistProfileRightPanel 
                      artist={artist}
                      artworks={artworks}
                      panelColor={colorTheme.panel}
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileLayout;
