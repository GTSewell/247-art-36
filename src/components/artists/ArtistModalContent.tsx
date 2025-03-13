
import React, { useRef } from "react";
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
  
  return (
    <div className="relative overflow-hidden bg-[#f7cf1e]">
      {/* Main content */}
      <div 
        ref={contentRef}
        className={`flex flex-col lg:flex-row w-full min-w-0 ${isMobile ? 'max-h-[85vh] overflow-y-auto px-4 max-w-full' : 'max-h-[80vh]'}`}
        style={isMobile ? { width: '100%', maxWidth: '100%', overflowX: 'hidden' } : undefined}
      >
        <div className="lg:w-1/2 overflow-hidden relative min-w-0">
          <ArtistImagePanel
            artist={selectedArtist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            refreshArtists={refreshArtists}
          />
        </div>
        
        <div className="lg:w-1/2 p-4 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto overflow-x-hidden min-w-0">
          <ArtistDetailsPanel
            artist={selectedArtist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            onSelect={handleSelect}
            isModalView={true}
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
