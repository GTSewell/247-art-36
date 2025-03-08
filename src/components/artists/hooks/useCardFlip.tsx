
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
    
    // Check if click originated from a button or interactive element
    const target = e.target as HTMLElement;
    
    // Interactive elements that should not trigger flip
    const interactiveSelectors = [
      'button', 
      '[data-button-container="true"]'
    ];
    
    // Check if the clicked element or any of its parents match the interactive selectors
    const isInteractiveElement = interactiveSelectors.some(selector => {
      return target.closest(selector) !== null || 
             target.matches(selector);
    });
    
    // Don't flip if clicking on a button or interactive element
    if (isInteractiveElement) {
      logger.info('Card flip aborted: clicked on interactive element');
      return;
    }
    
    logger.info(`Flipping card for artist ${artistId} from ${isFlipped ? 'back' : 'front'} to ${isFlipped ? 'front' : 'back'}`);
    
    // Use a callback to ensure we're using the latest state
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
