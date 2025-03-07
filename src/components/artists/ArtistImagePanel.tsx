
import React, { useState } from 'react';
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
  const { isFlipped, showClickIndicator, handleFlip, hideClickIndicator } = useCardFlip(artist.id);
  const { mainImageError, artworkErrors, handleMainImageError, handleArtworkImageError } = useImageErrors(artist.id, artist.name);

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

  // Debug log for flip state
  React.useEffect(() => {
    logger.info(`ArtistImagePanel - Artist: ${artist.id}, isFlipped: ${isFlipped}`);
  }, [isFlipped, artist.id]);

  // Handle card click with proper event propagation management
  const onCardClick = (e: React.MouseEvent) => {
    logger.info(`Card clicked for artist ${artist.id}, current flip state: ${isFlipped}`);
    handleFlip(e, isGeneratingArtworks);
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px]">
      <div 
        className="relative aspect-auto md:aspect-square h-full w-full overflow-hidden cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={onCardClick}
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
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute w-full h-full"
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
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute w-full h-full bg-white"
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
