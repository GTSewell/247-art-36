
import React, { useState, useEffect, useRef } from "react";
import { Artist } from "@/data/types/artist";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistCarouselNavigation from "./ArtistCarouselNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";

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
  
  // Touch handling states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  // Minimum swipe distance required (in pixels)
  const minSwipeDistance = 50;
  
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

  // Touch event handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setSwiping(true);
    setSwipeOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Calculate and set the swipe offset for visual feedback
    const offset = currentTouch - touchStart;
    setSwipeOffset(offset);
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) {
      setSwiping(false);
      setSwipeOffset(0);
      return;
    }

    // Calculate swipe distance
    const distance = touchEnd - touchStart;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;
    
    // Execute swipe actions based on direction
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setSwiping(false);
    setSwipeOffset(0);
  };
  
  // Apply dynamic styles for swipe animation
  const getSwipeStyles = () => {
    if (!swiping || swipeOffset === 0) return {};
    
    return {
      transform: `translateX(${swipeOffset * 0.2}px)`,
      transition: swiping ? 'none' : 'transform 0.3s ease-out'
    };
  };
  
  return (
    <div 
      ref={contentRef}
      className={`flex flex-col lg:flex-row w-full ${isMobile ? 'max-h-[85vh] overflow-y-scroll' : 'max-h-[80vh]'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={getSwipeStyles()}
    >
      <div className="lg:w-1/2 overflow-hidden relative">
        <ArtistImagePanel
          artist={selectedArtist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          refreshArtists={refreshArtists}
        />
      </div>
      
      <div className="lg:w-1/2 p-4 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
        <ArtistDetailsPanel
          artist={selectedArtist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          onSelect={handleSelect}
        />
      </div>
      
      <ArtistCarouselNavigation 
        isMobile={isMobile} 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
      />
      
      {isMobile && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/75 text-white px-4 py-2 rounded-full text-sm">
            Swipe to navigate artists {selectedArtistIndex + 1}/{artists.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistModalContent;
