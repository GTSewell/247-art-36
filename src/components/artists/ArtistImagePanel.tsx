
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClickIndicator } from './ClickIndicator';
import ArtistCardFront from './ArtistCardFront';
import ArtistCardBack from './ArtistCardBack';
import { useArtistData } from './hooks/useArtistData';
import { useCardFlip } from './hooks/useCardFlip';
import { useImageErrors } from './hooks/useImageErrors';
import { logger } from '@/utils/logger';
import { ArtistArtworksView } from './ArtistArtworksView';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists?: () => void;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite,
  refreshArtists
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);
  const isMobile = useIsMobile();
  const isModalView = true; // Always show artworks in modal view
  
  // Custom hooks
  const { currentArtist, refreshArtist } = useArtistData(artist, refreshArtists);
  const { isFlipped, showClickIndicator, handleFlip, hideClickIndicator, setFlipState } = useCardFlip(artist.id);
  const { mainImageError, artworkErrors, handleMainImageError, handleArtworkImageError } = useImageErrors(artist.id, artist.name);

  // Log artist and artworks data
  useEffect(() => {
    logger.info(`ArtistImagePanel - Artist "${currentArtist.name}" (ID: ${currentArtist.id})`);
    logger.info(`ArtistImagePanel - Artist image: ${currentArtist.image || 'No image'}`);
    
    if (currentArtist.artworks) {
      const artworksCount = Array.isArray(currentArtist.artworks) 
        ? currentArtist.artworks.length 
        : typeof currentArtist.artworks === 'string' 
          ? 'String format, needs parsing' 
          : 'Unknown format';
      
      logger.info(`ArtistImagePanel - Artworks: ${artworksCount}`);
      
      // Log individual artworks
      if (Array.isArray(currentArtist.artworks)) {
        currentArtist.artworks.forEach((artwork, index) => {
          logger.info(`ArtistImagePanel - Artwork ${index}: ${artwork || 'Empty'}`);
        });
      }
    } else {
      logger.info('ArtistImagePanel - No artworks available');
    }
  }, [currentArtist]);

  // Reset flip state when artist changes
  useEffect(() => {
    logger.info(`Artist changed to ${artist.id}, resetting flip state to front`);
    setFlipState(false);
  }, [artist.id, setFlipState]);

  // Handle mobile interaction
  const handleInteraction = () => {
    if (isMobile) {
      setIsHovered(true);
      hideClickIndicator();
      setTimeout(() => {
        setIsHovered(false);
      }, 3000);
    }
  };

  // If in modal view and desktop, show the artworks grid
  // For mobile modal view, we don't render anything here as the artworks are shown in the ArtistDetailsPanel
  if (isModalView) {
    if (!isMobile) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <ArtistArtworksView 
            artist={currentArtist}
            isGeneratingArtworks={isGeneratingArtworks}
            setIsGeneratingArtworks={setIsGeneratingArtworks}
            artworkErrors={artworkErrors}
            handleArtworkImageError={handleArtworkImageError}
            refreshArtworks={refreshArtist}
          />
        </div>
      );
    } else {
      // For mobile, return an empty div since artworks will be shown in DetailsPanel
      return (
        <div className="hidden">
          {/* Artwork grid is shown in the details panel for mobile */}
        </div>
      );
    }
  }

  // Fallback to the flippable card for non-modal views
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent event propagation to parent elements
    e.stopPropagation();
    
    logger.info(`Card clicked for artist ${artist.id}, current flip state: ${isFlipped ? 'back' : 'front'}`);
    if (!isGeneratingArtworks) {
      handleFlip();
      logger.info(`Flip state after handleFlip: ${!isFlipped ? 'back' : 'front'}`);
    } else {
      logger.info('Card flip aborted: artwork generation in progress');
    }
  };

  return (
    <div className="w-full h-full">
      <div 
        className="relative h-full w-full overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleCardClick}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleInteraction}
      >
        <AnimatePresence>
          <ClickIndicator 
            showClickIndicator={showClickIndicator}
            isHovered={isHovered}
            isMobile={isMobile}
          />
        </AnimatePresence>

        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.4 }}
              style={{ 
                transformStyle: 'preserve-3d', 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
              className="w-full h-full"
            >
              <ArtistCardFront 
                image={mainImageError ? '/placeholder.svg' : currentArtist.image}
                name={currentArtist.name}
                onImageError={handleMainImageError}
              />
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ duration: 0.4 }}
              style={{ 
                transformStyle: 'preserve-3d', 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
              className="w-full h-full"
            >
              <ArtistCardBack 
                artist={currentArtist}
                isGeneratingArtworks={isGeneratingArtworks}
                setIsGeneratingArtworks={setIsGeneratingArtworks}
                artworkErrors={artworkErrors}
                handleArtworkImageError={handleArtworkImageError}
                refreshArtworks={refreshArtist}
                onBackClick={handleCardClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;
