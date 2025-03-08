
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArtistArtworksView } from './ArtistArtworksView';
import { ClickIndicator } from './ClickIndicator';
import ArtistCardFront from './ArtistCardFront';
import { useArtistData } from './hooks/useArtistData';
import { useCardFlip } from './hooks/useCardFlip';
import { useImageErrors } from './hooks/useImageErrors';
import { logger } from '@/utils/logger';

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
  
  // Custom hooks
  const { currentArtist, refreshArtist } = useArtistData(artist, refreshArtists);
  const { isFlipped, showClickIndicator, handleFlip, hideClickIndicator, setFlipState } = useCardFlip(artist.id);
  const { mainImageError, artworkErrors, handleMainImageError, handleArtworkImageError } = useImageErrors(artist.id, artist.name);

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

  // Handle click on card for flipping
  const handleCardClick = () => {
    logger.info(`Card clicked, current flip state: ${isFlipped ? 'back' : 'front'}`);
    if (!isGeneratingArtworks) {
      handleFlip();
    } else {
      logger.info('Card flip aborted: artwork generation in progress');
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px]">
      <div 
        className="relative aspect-auto md:aspect-square h-full w-full overflow-hidden cursor-pointer"
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
              className="w-full h-full bg-white"
              data-testid="artist-card-back"
            >
              <ArtistArtworksView 
                artist={currentArtist}
                isGeneratingArtworks={isGeneratingArtworks}
                setIsGeneratingArtworks={setIsGeneratingArtworks}
                artworkErrors={artworkErrors}
                handleArtworkImageError={handleArtworkImageError}
                refreshArtworks={refreshArtist}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtistImagePanel;
