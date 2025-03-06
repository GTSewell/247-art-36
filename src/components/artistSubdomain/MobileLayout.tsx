
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
  const [activeTab, setActiveTab] = React.useState("about");
  
  // Initialize embla carousel with options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Handle tab change when clicking on tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update carousel slide based on tab
    if (emblaApi) {
      const tabIndex = {
        "about": 0,
        "links": 1,
        "artwork": 2
      }[value];
      
      emblaApi.scrollTo(tabIndex);
    }
  };

  // Setup effect to sync embla carousel with tabs
  React.useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const currentSlide = emblaApi.selectedScrollSnap();
      const tabs = ["about", "links", "artwork"];
      setActiveTab(tabs[currentSlide]);
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Calculate panel height to ensure consistent sizing
  const panelHeight = "calc(100vh - 6rem)"; // Accounting for tab height + margins

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
      <div className="w-full h-full px-4 py-4 flex flex-col">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 flex-1 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="about" className="data-[state=active]:bg-yellow-100">About</TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-yellow-100">Links</TabsTrigger>
              <TabsTrigger value="artwork" className="data-[state=active]:bg-yellow-100">Artwork</TabsTrigger>
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
            <div ref={emblaRef} className="h-full">
              <Carousel className="h-full">
                <CarouselContent className="h-full">
                  {/* About Panel */}
                  <CarouselItem className="h-full">
                    <div 
                      className="overflow-hidden shadow-lg w-full mx-auto my-2" 
                      style={{ 
                        backgroundColor: colorTheme.panel,
                        height: panelHeight,
                        borderRadius: '0.5rem',
                        width: 'calc(100% - 16px)', // Account for the carousel padding
                      }}
                    >
                      <ArtistProfileLeftPanel 
                        artist={artist} 
                        techniques={techniques}
                        styles={styles}
                        panelColor={colorTheme.panel}
                        badgeBgColor={colorTheme.badgeBg}
                      />
                    </div>
                  </CarouselItem>
                  
                  {/* Links Panel */}
                  <CarouselItem className="h-full">
                    <div 
                      className="overflow-hidden shadow-lg w-full mx-auto my-2" 
                      style={{ 
                        backgroundColor: colorTheme.panel,
                        height: panelHeight,
                        borderRadius: '0.5rem',
                        width: 'calc(100% - 16px)', // Account for the carousel padding
                      }}
                    >
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
                  
                  {/* Artwork Panel */}
                  <CarouselItem className="h-full">
                    <div 
                      className="overflow-hidden shadow-lg w-full mx-auto my-2" 
                      style={{ 
                        backgroundColor: colorTheme.panel,
                        height: panelHeight,
                        borderRadius: '0.5rem',
                        width: 'calc(100% - 16px)', // Account for the carousel padding
                      }}
                    >
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileLayout;
