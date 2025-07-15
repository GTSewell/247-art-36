import { useState, useEffect, useCallback } from 'react';
import { storeCategories } from '@/components/store/utils/categoryUtils';

interface StoreFlashState {
  isFlashing: boolean;
  isLoaded: boolean;
}

interface UseStoreSequentialFlashPreloaderReturn {
  flashStates: Record<string, StoreFlashState>;
  isAllLoaded: boolean;
}

export const useStoreSequentialFlashPreloader = (): UseStoreSequentialFlashPreloaderReturn => {
  const [flashStates, setFlashStates] = useState<Record<string, StoreFlashState>>(() => {
    const initial: Record<string, StoreFlashState> = {};
    storeCategories.forEach(category => {
      initial[category.id] = { isFlashing: false, isLoaded: false };
    });
    return initial;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAllLoaded, setIsAllLoaded] = useState(false);

  const preloadImage = useCallback((imageUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = imageUrl;
    });
  }, []);

  const processNextImage = useCallback(async () => {
    if (currentIndex >= storeCategories.length) {
      setIsAllLoaded(true);
      return;
    }

    const category = storeCategories[currentIndex];
    
    // Start flash animation
    setFlashStates(prev => ({
      ...prev,
      [category.id]: { ...prev[category.id], isFlashing: true }
    }));

    try {
      // Preload the image
      await preloadImage(category.image);

      // Keep flash for 150ms then mark as loaded
      setTimeout(() => {
        setFlashStates(prev => ({
          ...prev,
          [category.id]: { isFlashing: false, isLoaded: true }
        }));

        // Move to next image after a short delay
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 50);
      }, 150);

    } catch (error) {
      console.warn(`Failed to preload store image for ${category.id}:`, error);
      // Still mark as loaded to continue sequence
      setFlashStates(prev => ({
        ...prev,
        [category.id]: { isFlashing: false, isLoaded: true }
      }));
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 50);
    }
  }, [currentIndex, preloadImage]);

  useEffect(() => {
    if (currentIndex < storeCategories.length) {
      const timer = setTimeout(processNextImage, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, processNextImage]);

  useEffect(() => {
    // Start the sequence
    if (currentIndex === 0) {
      processNextImage();
    }
  }, [processNextImage]);

  return { flashStates, isAllLoaded };
};
