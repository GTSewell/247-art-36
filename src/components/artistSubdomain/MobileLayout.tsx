
import React from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/tabs';
import useEmblaCarousel from 'embla-carousel-react';
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
