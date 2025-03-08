
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
    
    // Reset the flip state when the artist ID changes
    setIsFlipped(false);
    
    logger.info(`useCardFlip initialized for artist ${artistId} - show indicator: ${!hasFlipped}, isFlipped: ${isFlipped}`);
  }, [artistId]);

  // Handle card flip with improved logging
  const handleFlip = () => {
    logger.info(`handleFlip called for artist ${artistId} - current state: ${isFlipped ? 'back' : 'front'}`);
    
    // Toggle the flipped state
    setIsFlipped(prevState => {
      const newState = !prevState;
      logger.info(`Toggling flip state from ${prevState ? 'back' : 'front'} to ${newState ? 'back' : 'front'}`);
      return newState;
    });
    
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artistId}`, 'true');
      logger.info(`Click indicator hidden and saved to localStorage for artist ${artistId}`);
    }
  };

  const hideClickIndicator = () => {
    if (showClickIndicator) {
      setShowClickIndicator(false);
      localStorage.setItem(`flipped-${artistId}`, 'true');
      logger.info(`Click indicator manually hidden for artist ${artistId}`);
    }
  };

  // Force flip to front or back with debugging
  const setFlipState = (flipped: boolean) => {
    logger.info(`Manually setting flip state to: ${flipped ? 'back' : 'front'} for artist ${artistId}`);
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
