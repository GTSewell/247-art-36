
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useCardFlip = (artistId: number) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showClickIndicator, setShowClickIndicator] = useState(true);
  
  // Check if the user has flipped the card before
  useEffect(() => {
    const hasFlipped = localStorage.getItem(`flipped-${artistId}`);
    if (hasFlipped) {
      setShowClickIndicator(false);
    }
  }, [artistId]);

  // Handle card flip
  const handleFlip = (e: React.MouseEvent, isGeneratingArtworks: boolean) => {
    // Log the click event for debugging
    logger.info(`Card flip triggered for artist ${artistId}`);
    
    // Don't flip if we're in the middle of an operation
    if (isGeneratingArtworks) {
      logger.info('Card flip aborted: artwork generation in progress');
      return;
    }
    
    logger.info(`Flipping card for artist ${artistId} from ${isFlipped ? 'back' : 'front'} to ${isFlipped ? 'front' : 'back'}`);
    
    // Simply toggle the flipped state
    setIsFlipped(prevState => !prevState);
    
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artistId}`, 'true');
    }
  };

  const hideClickIndicator = () => {
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artistId}`, 'true');
    }
  };

  // Force flip to front or back
  const setFlipState = (flipped: boolean) => {
    logger.info(`Manually setting flip state to: ${flipped ? 'back' : 'front'}`);
    setIsFlipped(flipped);
  };

  return { 
    isFlipped, 
    showClickIndicator, 
    handleFlip,
    hideClickIndicator,
    setFlipState
  };
};
