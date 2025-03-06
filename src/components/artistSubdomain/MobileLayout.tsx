
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
  const emblaRef = useRef<HTMLDivElement>(null);
  
  // Initialize embla carousel
  const [emblaApi, setEmblaApi] = useState<any>(null);

  // Setup embla carousel separately for more control
  useEffect(() => {
    if (emblaRef.current) {
      const embla = useEmblaCarousel(emblaRef.current, {
        align: "start",
        loop: false,
        dragFree: false,
        containScroll: "trimSnaps",
        slidesToScroll: 1
      });
      
      if (embla && embla[1]) {
        setEmblaApi(embla[1]);
      }
    }
    
    return () => {
      if (emblaApi) {
        emblaApi.destroy();
      }
    };
  }, []);

  // Handle tab change and carousel sync
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (emblaApi) {
      const slideIndex = value === "about" ? 0 : value === "links" ? 1 : 2;
      emblaApi.scrollTo(slideIndex);
    }
  }, [emblaApi]);

  // Listen to carousel changes and update tabs
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const currentSlide = emblaApi.selectedScrollSnap();
      const tabs = ["about", "links", "artwork"];
      if (currentSlide >= 0 && currentSlide < tabs.length) {
        setActiveTab(tabs[currentSlide]);
      }
    };
    
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

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
