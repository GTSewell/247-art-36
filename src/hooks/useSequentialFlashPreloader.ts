import { useState, useEffect, useCallback, useRef } from 'react';

interface FlashPreloaderState {
  currentlyLoading: string | null;
  loadedImages: Set<string>;
  allCompleted: boolean;
  isFlashing: boolean;
}

interface UseSequentialFlashPreloaderOptions {
  flashDuration?: number; // Duration of flash animation in ms
  delayBetweenImages?: number; // Delay between loading each image in ms
  startOnMount?: boolean;
}

export const useSequentialFlashPreloader = (
  imageUrls: string[],
  options: UseSequentialFlashPreloaderOptions = {}
) => {
  const {
    flashDuration = 150,
    delayBetweenImages = 100,
    startOnMount = true
  } = options;

  const [state, setState] = useState<FlashPreloaderState>({
    currentlyLoading: null,
    loadedImages: new Set(),
    allCompleted: false,
    isFlashing: false
  });

  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }, []);

  const loadNextImage = useCallback(async () => {
    if (currentIndexRef.current >= imageUrls.length) {
      setState(prev => ({ ...prev, allCompleted: true, currentlyLoading: null }));
      return;
    }

    const currentUrl = imageUrls[currentIndexRef.current];
    
    // Start flash animation
    setState(prev => ({ 
      ...prev, 
      currentlyLoading: currentUrl, 
      isFlashing: true 
    }));

    try {
      // Load the image
      await preloadImage(currentUrl);
      
      // Add to loaded set
      setState(prev => ({ 
        ...prev, 
        loadedImages: new Set([...prev.loadedImages, currentUrl])
      }));

      // Keep flash for specified duration
      flashTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isFlashing: false }));
        
        // Move to next image after delay
        loadingTimeoutRef.current = setTimeout(() => {
          currentIndexRef.current++;
          loadNextImage();
        }, delayBetweenImages);
      }, flashDuration);

    } catch (error) {
      console.warn(`Failed to preload image: ${currentUrl}`, error);
      
      // Still move to next image on error
      setState(prev => ({ ...prev, isFlashing: false }));
      loadingTimeoutRef.current = setTimeout(() => {
        currentIndexRef.current++;
        loadNextImage();
      }, delayBetweenImages);
    }
  }, [imageUrls, preloadImage, flashDuration, delayBetweenImages]);

  const startPreloading = useCallback(() => {
    if (imageUrls.length === 0) return;
    
    currentIndexRef.current = 0;
    setState({
      currentlyLoading: null,
      loadedImages: new Set(),
      allCompleted: false,
      isFlashing: false
    });
    
    // Start the sequential loading
    loadNextImage();
  }, [imageUrls, loadNextImage]);

  // Auto-start on mount if enabled
  useEffect(() => {
    if (startOnMount && imageUrls.length > 0) {
      startPreloading();
    }

    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, [startOnMount, startPreloading]);

  // Utility functions
  const isImageLoaded = useCallback((url: string) => {
    return state.loadedImages.has(url);
  }, [state.loadedImages]);

  const isImageCurrentlyLoading = useCallback((url: string) => {
    return state.currentlyLoading === url;
  }, [state.currentlyLoading]);

  const shouldFlash = useCallback((url: string) => {
    return state.currentlyLoading === url && state.isFlashing;
  }, [state.currentlyLoading, state.isFlashing]);

  return {
    isImageLoaded,
    isImageCurrentlyLoading,
    shouldFlash,
    allCompleted: state.allCompleted,
    currentlyLoading: state.currentlyLoading,
    startPreloading,
    loadedCount: state.loadedImages.size,
    totalCount: imageUrls.length
  };
};
