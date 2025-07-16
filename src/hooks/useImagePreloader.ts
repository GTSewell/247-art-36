import { useEffect, useState, useCallback } from 'react';

interface ImagePreloadState {
  [url: string]: {
    loaded: boolean;
    loading: boolean;
    error: boolean;
  };
}

interface UseImagePreloaderOptions {
  priority?: boolean;
  preloadOnMount?: boolean;
}

export const useImagePreloader = (imageUrls: string[], options: UseImagePreloaderOptions = {}) => {
  const { priority = false, preloadOnMount = true } = options;
  
  const [preloadState, setPreloadState] = useState<ImagePreloadState>(() => {
    const initialState: ImagePreloadState = {};
    imageUrls.forEach(url => {
      initialState[url] = { loaded: false, loading: false, error: false };
    });
    return initialState;
  });

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Update loading state
      setPreloadState(prev => {
        // Check if image is already loaded in current state
        if (prev[url]?.loaded) {
          resolve();
          return prev;
        }
        
        return {
          ...prev,
          [url]: { ...prev[url], loading: true, error: false }
        };
      });

      const img = new Image();
      
      img.onload = () => {
        setPreloadState(prev => ({
          ...prev,
          [url]: { loaded: true, loading: false, error: false }
        }));
        resolve();
      };

      img.onerror = () => {
        setPreloadState(prev => ({
          ...prev,
          [url]: { loaded: false, loading: false, error: true }
        }));
        reject(new Error(`Failed to load image: ${url}`));
      };

      // Start loading
      img.src = url;
    });
  }, []); // Remove preloadState from dependencies

  const preloadImages = useCallback(async (urls: string[] = imageUrls) => {
    if (priority) {
      // Load critical images sequentially for better performance
      for (const url of urls) {
        try {
          await preloadImage(url);
        } catch (error) {
          console.warn(`Failed to preload priority image: ${url}`, error);
        }
      }
    } else {
      // Load non-critical images in parallel
      const promises = urls.map(url => 
        preloadImage(url).catch(error => 
          console.warn(`Failed to preload image: ${url}`, error)
        )
      );
      await Promise.allSettled(promises);
    }
  }, [imageUrls, priority, preloadImage]);

  // Auto-preload on mount if enabled
  useEffect(() => {
    if (preloadOnMount && imageUrls.length > 0) {
      preloadImages();
    }
  }, [imageUrls, preloadOnMount, preloadImages]);

  const isImageLoaded = useCallback((url: string) => preloadState[url]?.loaded || false, [preloadState]);
  const isImageLoading = useCallback((url: string) => preloadState[url]?.loading || false, [preloadState]);
  const hasImageError = useCallback((url: string) => preloadState[url]?.error || false, [preloadState]);
  
  const allImagesLoaded = imageUrls.every(url => preloadState[url]?.loaded);
  const anyImageLoading = imageUrls.some(url => preloadState[url]?.loading);

  return {
    preloadImages,
    preloadImage,
    isImageLoaded,
    isImageLoading,
    hasImageError,
    allImagesLoaded,
    anyImageLoading,
    preloadState
  };
};

// Hook specifically for accordion overlay images
export const useAccordionImagePreloader = () => {
  // Homepage accordion images
  const homepageImages = [
    '/lovable-uploads/72e52037-cd09-40b1-8993-ea48e64c2f6f.png', // PRINT
    '/lovable-uploads/5853f257-8088-4bdf-8e60-82e6f6350eb1.png', // EVENTS
    '/lovable-uploads/8e976936-1c21-424f-86b2-36cfecc6eacd.png', // ARTISTS
    '/lovable-uploads/0e792c6e-d4f2-45f3-9de6-f1c897a07f79.png', // GALLERY
    '/lovable-uploads/6a02808c-6f26-4b2b-81ca-342a5be9d9b9.png'  // SERVICES
  ];

  return useImagePreloader(homepageImages, { 
    priority: true, 
    preloadOnMount: true 
  });
};