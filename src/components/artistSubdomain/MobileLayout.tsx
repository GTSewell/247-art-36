
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [activeTab, setActiveTab] = useState("about");
  const emblaRef = useRef(null);
  
  // Initialize embla carousel with proper options
  const [emblaApi, emblaHelper] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1
  });

  // Setup carousel events
  useEffect(() => {
    if (!emblaHelper) return;
    
    const onSelect = () => {
      const currentSlide = emblaHelper.selectedScrollSnap();
      const tabs = ["about", "links", "artwork"];
      if (currentSlide >= 0 && currentSlide < tabs.length) {
        setActiveTab(tabs[currentSlide]);
      }
    };
    
    emblaHelper.on('select', onSelect);
    
    return () => {
      emblaHelper.off('select', onSelect);
    };
  }, [emblaHelper]);

  // Handle tab change and carousel sync
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (emblaHelper) {
      const slideIndex = value === "about" ? 0 : value === "links" ? 1 : 2;
      emblaHelper.scrollTo(slideIndex);
    }
  }, [emblaHelper]);

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  // Calculate panel height to ensure consistent sizing
  const panelHeight = "calc(100vh - 6rem)";

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
              emblaApi={emblaHelper}
              setEmblaRef={emblaApi}
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
