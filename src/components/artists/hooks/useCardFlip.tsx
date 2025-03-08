
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

  // Handle card flip - simplified version
  const handleFlip = () => {
    logger.info(`Flipping card for artist ${artistId} from ${isFlipped ? 'back' : 'front'} to ${isFlipped ? 'front' : 'back'}`);
    
    // Toggle the flipped state
    setIsFlipped(!isFlipped);
    
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
