
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import MobileNavigation from './MobileNavigation';
import MobileCarousel from './MobileCarousel';

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
  
  // Initialize embla carousel with specific options
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    watchDrag: true, // Ensure drag events are properly watched
    watchResize: true, // React to resize events (important for mobile)
    skipSnaps: false, // Force stopping at defined slides only
  });

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Handle tab change when clicking on tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (emblaApi) {
      const tabIndex = {
        "about": 0,
        "links": 1,
        "artwork": 2
      }[value];
      
      if (tabIndex !== undefined) {
        emblaApi.scrollTo(tabIndex);
      }
    }
  };

  // Setup effect to sync embla carousel with tabs
  React.useEffect(() => {
    if (!emblaApi) return;

    const syncTabsOnChange = () => {
      try {
        const currentSlide = emblaApi.selectedScrollSnap();
        console.log('Current slide index:', currentSlide);
        
        const tabs = ["about", "links", "artwork"];
        if (currentSlide >= 0 && currentSlide < tabs.length) {
          const newTab = tabs[currentSlide];
          console.log('Setting active tab to:', newTab);
          setActiveTab(newTab);
        }
      } catch (error) {
        console.error('Error syncing tabs:', error);
      }
    };
    
    // Using both select and settle events for more reliable updates
    emblaApi.on('select', syncTabsOnChange);
    emblaApi.on('settle', syncTabsOnChange); 
    
    // Run once on initial load
    syncTabsOnChange();
    
    return () => {
      emblaApi.off('select', syncTabsOnChange);
      emblaApi.off('settle', syncTabsOnChange);
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
          <MobileNavigation 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            handleReturnToArtists={handleReturnToArtists}
          />
          
          <div className="flex-grow overflow-hidden">
            <MobileCarousel 
              emblaRef={emblaRef}
              artist={artist}
              profile={profile}
              techniques={techniques}
              styles={styles}
              socialPlatforms={socialPlatforms}
              artworks={artworks}
              panelHeight={panelHeight}
              colorTheme={colorTheme}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileLayout;
