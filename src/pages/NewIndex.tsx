import React, { useState } from "react";
import { useAppMode } from "@/contexts/AppModeContext";
import Navigation from "@/components/navigation/Navigation";
import PWANavigation from "@/components/pwa/PWANavigation";
import { Helmet } from "react-helmet";
import { useArtists } from "@/hooks/use-artists";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";
import { Accordion } from "@/components/ui/accordion";
import HeroSection from "@/components/home/HeroSection";
import PrintSection from "@/components/home/PrintSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import GallerySection from "@/components/home/GallerySection";
import EventsSection from "@/components/home/EventsSection";
import ServicesSection from "@/components/home/ServicesSection";
import JoinSection from "@/components/home/JoinSection";
import { useEnhancedAccordionScroll } from "@/hooks/useEnhancedAccordionScroll";
import { useAccordionImagePreloader } from "@/hooks/useImagePreloader";
import ImagePreloader from "@/components/optimization/ImagePreloader";
const NewIndex = () => {
  const { isPWA } = useAppMode();
  const { featuredArtists, additionalArtists, isLoading } = useArtists();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteArtists] = useState<Set<number>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string>('');
  const { registerTrigger, registerContent, handleAccordionChange } = useEnhancedAccordionScroll();
  
  // Preload all homepage accordion images on mount
  useAccordionImagePreloader();
  
  // Critical images for HTML preloading
  const criticalImages = [
    '/lovable-uploads/72e52037-cd09-40b1-8993-ea48e64c2f6f.png', // PRINT
    '/lovable-uploads/5853f257-8088-4bdf-8e60-82e6f6350eb1.png', // EVENTS
    '/lovable-uploads/8e976936-1c21-424f-86b2-36cfecc6eacd.png'  // ARTISTS
  ];
  
  const galleryImages = [
    "/lovable-uploads/7d317cc0-5f48-4fee-900a-e34d88b885e4.png",
    "/lovable-uploads/05961de3-7b21-4c2e-926e-77068d8d2afa.png", 
    "/lovable-uploads/3d9d2624-e707-4078-b191-5ddfbc0f13df.png",
    "/lovable-uploads/545e1c86-4b62-4984-8848-a199a3680d7d.png",
    "/lovable-uploads/10d7209a-20b1-45b0-afe3-61990d0d37f1.png",
    "/lovable-uploads/f6ef7840-2e05-4248-950f-06fd5cf01e6f.png",
    "/lovable-uploads/6335b203-485c-47c6-8717-0b6fac321826.png"
  ];

  const nextGalleryImage = () => {
    setCurrentGalleryIndex(prev => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleArtistClick = (artist: any, index: number) => {
    setSelectedArtist(artist);
    setSelectedArtistIndex(index);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    setSelectedArtistIndex(index);
    setSelectedArtist([...featuredArtists, ...additionalArtists][index]);
  };
  return (
    <>
      <Helmet>
        <meta property="og:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <link rel="icon" href="https://247.art/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="247.ART" />
        <meta name="twitter:description" content="247.ART - Art Never Sleeps" />
        <meta name="twitter:image" content="https://247.art/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png" />
        <script async src="https://tally.so/widgets/embed.js"></script>
      </Helmet>
      
      {/* Preload critical accordion images */}
      <ImagePreloader images={criticalImages} priority={true} />
      
      {/* Theme-aware Background */}
      <div className="fixed inset-0 -z-10 bg-background" />

      <main className="min-h-screen relative text-foreground">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        {/* Collapsible Sections */}
        <div className="w-full pl-4 md:pl-8 lg:pl-12 pr-4 md:pr-8 lg:pr-12">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={selectedSection}
            onValueChange={(value) => {
              handleAccordionChange(value, selectedSection, setSelectedSection);
            }}
          >
            <HeroSection 
              onTriggerRef={(element) => registerTrigger('hero', element)}
              onContentRef={(element) => registerContent('hero', element)}
            />
            <PrintSection 
              onTriggerRef={(element) => registerTrigger('print', element)}
              onContentRef={(element) => registerContent('print', element)}
            />
            <ArtistsSection
              featuredArtists={featuredArtists}
              additionalArtists={additionalArtists}
              isLoading={isLoading}
              onArtistClick={handleArtistClick}
              onTriggerRef={(element) => registerTrigger('artists', element)}
              onContentRef={(element) => registerContent('artists', element)}
            />
            <GallerySection
              galleryImages={galleryImages}
              currentGalleryIndex={currentGalleryIndex}
              onNextImage={nextGalleryImage}
              onPrevImage={prevGalleryImage}
              onTriggerRef={(element) => registerTrigger('gallery', element)}
              onContentRef={(element) => registerContent('gallery', element)}
            />
            <EventsSection 
              onTriggerRef={(element) => registerTrigger('events', element)}
              onContentRef={(element) => registerContent('events', element)}
            />
            <ServicesSection 
              onTriggerRef={(element) => registerTrigger('services', element)}
              onContentRef={(element) => registerContent('services', element)}
            />
          </Accordion>
        </div>

        <JoinSection />

        {/* Artist Detail Modal */}
        <ArtistDetailModal 
          artists={[...featuredArtists, ...additionalArtists]} 
          selectedArtist={selectedArtist} 
          selectedArtistIndex={selectedArtistIndex} 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          onArtistChange={handleArtistChange} 
          onFavoriteToggle={() => {}} 
          favoriteArtists={favoriteArtists} 
          refreshArtists={() => {}} 
          onSelect={setSelectedArtist} 
        />
      </main>
    </>
  );
};
export default NewIndex;