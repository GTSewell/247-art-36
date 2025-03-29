
import React, { useRef, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import ArtistHeaderInfo from "./ArtistHeaderInfo";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistCarouselNavigation from "./ArtistCarouselNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";
import ArtistActions from "./ArtistActions";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const selectedArtist = artists[selectedArtistIndex];
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Check if artist is a Signature Artist (ID >= 26)
  const isSignatureArtist = selectedArtist?.id >= 26;
  
  // Log when the modal content is rendered
  React.useEffect(() => {
    logger.info(`Modal content rendered for artist: ${selectedArtist.name} (ID: ${selectedArtist.id})`);
  }, [selectedArtist]);
  
  const isFavorite = favoriteArtists.has(selectedArtist.id);

  // Direct navigation to artist profile page
  const handleNavigateToArtistProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Format the artist name for the URL (remove spaces and special characters)
    const formattedName = selectedArtist.name.replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
    logger.info(`Navigating to artist profile from modal: ${formattedName}`);
    
    // Navigate to the artist's profile page
    navigate(`/artists/${formattedName}`);
  };
  
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

  if (isMobile) {
    // Mobile view remains unchanged
    return (
      <div className="relative overflow-hidden bg-white">
        <div 
          ref={contentRef}
          className={`flex flex-col w-full max-h-[85vh] overflow-y-auto ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`}
          style={{ background: 'white' }}
        >
          {/* Signature Artist Badge - Added to mobile */}
          {isSignatureArtist && (
            <div className="bg-zap-red text-[#333333] font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px] absolute top-3 left-3 z-50">
              Signature Artist
            </div>
          )}
          
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
              domainName={selectedArtist.name}
              artistId={selectedArtist.id}
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
              handleDomainClick={handleNavigateToArtistProfile}
              useSubPath={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop view based on screenshot 2
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Signature Artist Badge - Added to desktop */}
      {isSignatureArtist && (
        <div className="bg-zap-red text-[#333333] font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px] absolute top-3 left-3 z-50">
          Signature Artist
        </div>
      )}
      
      <div 
        ref={contentRef}
        className={`flex flex-row max-h-[70vh] ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`}
        style={{ background: 'white' }}
      >
        {/* Left side: Artwork grid */}
        <div className="w-3/5 p-6">
          <ArtistImagePanel
            artist={selectedArtist}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite}
            refreshArtists={refreshArtists}
          />
        </div>
        
        {/* Right side: Artist info and actions */}
        <div className="w-2/5 p-6 flex flex-col">
          <div className="mb-auto">
            <ArtistHeaderInfo
              name={selectedArtist.name}
              specialty={selectedArtist.specialty}
              city={selectedArtist.city}
              country={selectedArtist.country}
            />
          </div>
          
          {/* Action buttons at bottom of right panel */}
          <div className="mt-auto pt-4">
            <ArtistActions
              domainName={selectedArtist.name}
              artistId={selectedArtist.id}
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
              handleDomainClick={handleNavigateToArtistProfile}
              useSubPath={false}
            />
          </div>
        </div>
      </div>
      
      {/* Desktop navigation arrows */}
      <ArtistCarouselNavigation 
        isMobile={isMobile} 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
      />
    </div>
  );
};

export default ArtistModalContent;
