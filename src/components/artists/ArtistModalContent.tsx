
import React, { useRef, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";
import { useNavigate } from "react-router-dom";
import MobileArtistContent from "./MobileArtistContent";
import DesktopArtistContent from "./DesktopArtistContent";

interface ArtistModalContentProps {
  artists: Artist[];
  selectedArtistIndex: number;
  selectedArtist?: Artist | null;
  onArtistChange: (index: number) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistModalContent: React.FC<ArtistModalContentProps> = ({
  artists,
  selectedArtistIndex,
  selectedArtist: selectedArtistProp,
  onArtistChange,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  onSelect
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const selectedArtist = selectedArtistProp || artists[selectedArtistIndex];
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Check if artist is a Signature Artist (ID >= 26)
  const isSignatureArtist = selectedArtist?.id >= 26;
  
  // Check if artist should show Demo badge (not ID 24 or ID 26)
  const isDemo = selectedArtist?.id !== 24 && selectedArtist?.id !== 26;
  
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
    return (
      <div className="relative overflow-hidden bg-white" ref={contentRef}>
        <MobileArtistContent
          artist={selectedArtist}
          onFavoriteToggle={onFavoriteToggle}
          isFavorite={isFavorite}
          refreshArtists={refreshArtists}
          handleNavigateToArtistProfile={handleNavigateToArtistProfile}
          isSignatureArtist={isSignatureArtist}
          isDemo={isDemo}
        />
      </div>
    );
  }

  return (
    <div ref={contentRef}>
      <DesktopArtistContent
        artist={selectedArtist}
        onFavoriteToggle={onFavoriteToggle}
        isFavorite={isFavorite}
        refreshArtists={refreshArtists}
        handleNavigateToArtistProfile={handleNavigateToArtistProfile}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isMobile={isMobile}
        isSignatureArtist={isSignatureArtist}
        isDemo={isDemo}
      />
    </div>
  );
};

export default ArtistModalContent;
