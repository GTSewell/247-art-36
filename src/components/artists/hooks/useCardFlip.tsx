
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export const useCardFlip = (artistId: number) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showClickIndicator, setShowClickIndicator] = useState(true);
  
  // Reset flip state when artist changes
  useEffect(() => {
    setIsFlipped(false);
    logger.info(`Reset flip state for artist ${artistId}`);
  }, [artistId]);
  
  // Check if the user has flipped the card before
  useEffect(() => {
    const hasFlipped = localStorage.getItem(`flipped-${artistId}`);
    if (hasFlipped) {
      setShowClickIndicator(false);
      logger.info(`User previously flipped card for artist ${artistId}, hiding indicator`);
    }
  }, [artistId]);

  // Handle card flip
  const handleFlip = (e: React.MouseEvent, isGeneratingArtworks: boolean) => {
    // Check if click originated from a button or interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'BUTTON' || 
      target.closest('button') ||
      target.closest('[data-button-container="true"]') ||
      target.getAttribute('data-button-container') === 'true' ||
      target.closest('[data-no-flip="true"]') ||
      target.getAttribute('data-no-flip') === 'true';
    
    // Don't flip if clicking on a button or if we're in the middle of an operation
    if (isInteractiveElement || isGeneratingArtworks) {
      logger.info(`Flip prevented for artist ${artistId}: interactive element clicked or generating artworks`);
      return;
    }
    
    logger.info(`Flipping card for artist ${artistId} from ${isFlipped ? 'back' : 'front'} to ${isFlipped ? 'front' : 'back'}`);
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

  return { 
    isFlipped, 
    showClickIndicator, 
    handleFlip,
    hideClickIndicator
  };
};
