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
const NewIndex = () => {
  const { isPWA } = useAppMode();
  const { featuredArtists, additionalArtists, isLoading } = useArtists();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteArtists] = useState<Set<number>>(new Set());
  
  const galleryImages = [
    "/lovable-uploads/69af7803-27d7-4f04-b312-6169327229b3.png",
    "/lovable-uploads/71405033-4f8a-40d6-b459-a95523ca10f8.png", 
    "/lovable-uploads/77d6eca3-c8ee-469f-8975-11645265224b.png",
    "/lovable-uploads/80693eda-1198-40da-8f3e-795e24bb4897.png",
    "/lovable-uploads/96c594a0-80b9-4675-b599-deb4ad4802b8.png",
    "/lovable-uploads/b4d254c3-2988-4d1a-97ad-beb4e333e55c.png"
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
      </Helmet>
      
      {/* Simple White Background */}
      <div className="fixed inset-0 -z-10 bg-white" />

      <main className="min-h-screen relative text-black">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        {/* Collapsible Sections */}
        <div className="w-full pl-4 md:pl-8 lg:pl-12 pr-4 md:pr-8 lg:pr-12">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            onValueChange={(value) => {
              if (value) {
                setTimeout(() => {
                  const element = document.querySelector(`[data-state="open"] .accordion-trigger`);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start',
                      inline: 'nearest'
                    });
                  }
                }, 100);
              }
            }}
          >
            <HeroSection />
            <PrintSection />
            <ArtistsSection
              featuredArtists={featuredArtists}
              additionalArtists={additionalArtists}
              isLoading={isLoading}
              onArtistClick={handleArtistClick}
            />
            <GallerySection
              galleryImages={galleryImages}
              currentGalleryIndex={currentGalleryIndex}
              onNextImage={nextGalleryImage}
              onPrevImage={prevGalleryImage}
            />
            <EventsSection />
            <ServicesSection />
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