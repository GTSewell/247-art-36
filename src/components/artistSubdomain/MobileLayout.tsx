
import React, { useState, useEffect, useCallback } from 'react';
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
  backgroundImage?: string | null;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  artist,
  profile,
  techniques,
  styles,
  socialPlatforms,
  artworks,
  colorTheme,
  backgroundImage
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1
  });

  // Synchronize carousel position with tab selection
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

  // Handle tab change and scroll carousel to matching slide
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (emblaApi) {
      const slideIndex = value === "about" ? 0 : value === "links" ? 1 : 2;
      emblaApi.scrollTo(slideIndex);
    }
  }, [emblaApi]);

  const handleReturnToArtists = () => {
    navigate('/artists');
  };

  const panelHeight = "calc(100vh - 7rem)";
  
  // Use explicitly set background image if available, otherwise fallback to profile background
  const bgImage = backgroundImage || profile?.background_image || undefined;

  return (
    <div 
      className="flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: colorTheme.background,
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
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
            colorTheme={colorTheme}
          />
          
          <div className="flex-grow overflow-hidden">
            <MobileCarousel 
              emblaApi={emblaApi}
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
