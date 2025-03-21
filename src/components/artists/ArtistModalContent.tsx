
import React, { useRef, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import ArtistHeaderInfo from "./ArtistHeaderInfo";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistCarouselNavigation from "./ArtistCarouselNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";
import ArtistActions from "./ArtistActions";

interface ArtistModalContentProps {
  artists: Artist[];
  selectedArtistIndex: number;
  onArtistChange: (index: number) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistModalContent: React.FC<ArtistModalContentProps> = ({
  artists,
  selectedArtistIndex,
  onArtistChange,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  onSelect
}) => {
  const isMobile = useIsMobile();
  const selectedArtist = artists[selectedArtistIndex];
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Log when the modal content is rendered
  React.useEffect(() => {
    logger.info(`Modal content rendered for artist: ${selectedArtist.name} (ID: ${selectedArtist.id})`);
  }, [selectedArtist]);
  
  const isFavorite = favoriteArtists.has(selectedArtist.id);

  // Create a handler that adapts onSelect to the expected event signature
  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(selectedArtist);
    logger.info(`Select handler called for artist: ${selectedArtist.name}`);
  };
  
  // Create handlers for next and previous that implement looping
  const handlePrevious = () => {
    const newIndex = selectedArtistIndex === 0 ? artists.length - 1 : selectedArtistIndex - 1;
    logger.info(`Navigating to previous artist, new index: ${newIndex}`);
    onArtistChange(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = selectedArtistIndex === artists.length - 1 ? 0 : selectedArtistIndex + 1;
    logger.info(`Navigating to next artist, new index: ${newIndex}`);
    onArtistChange(newIndex);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation if modal is visible
      if (contentRef.current) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevious();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArtistIndex, artists.length]);

  // Format the domain for the artist
  const artistDomain = selectedArtist.name ? selectedArtist.name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '') : '';

  return (
    <div className="relative overflow-hidden bg-white">
      <div 
        ref={contentRef}
        className={`flex flex-col w-full ${isMobile ? 'max-h-[85vh] overflow-y-auto' : 'max-h-[70vh]'}`}
        style={{ background: 'white' }}
      >
        {/* Header Section */}
        <div className="px-6 pt-6 pb-2">
          <ArtistHeaderInfo
            name={selectedArtist.name}
            specialty={selectedArtist.specialty}
            city={selectedArtist.city}
            country={selectedArtist.country}
          />
        </div>
        
        {/* Artworks Grid Section */}
        <div className="px-6 flex-grow">
          <ArtistImagePanel
            artist={selectedArtist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            refreshArtists={refreshArtists}
          />
        </div>
        
        {/* Bottom Action Buttons - with increased space above */}
        <div className="px-6 pb-6 pt-4 mt-auto">
          <ArtistActions
            domainName={artistDomain}
            artistId={selectedArtist.id}
            isFavorite={isFavorite}
            onFavoriteToggle={onFavoriteToggle}
            handleDomainClick={handleSelect}
            useSubPath={false}
          />
        </div>
      </div>
      
      {/* Desktop navigation arrows - only shown in desktop mode */}
      {!isMobile && (
        <ArtistCarouselNavigation 
          isMobile={isMobile} 
          onPrevious={handlePrevious} 
          onNext={handleNext} 
        />
      )}
    </div>
  );
};

export default ArtistModalContent;
