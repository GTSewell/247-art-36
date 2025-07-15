import { useImagePreloader } from './useImagePreloader';
import { storeCategories } from '@/components/store/utils/categoryUtils';

// Hook specifically for store category images
export const useStoreImagePreloader = () => {
  // Extract all store category images
  const storeImages = storeCategories.map(category => category.image);

  return useImagePreloader(storeImages, { 
    priority: false, // Store images are secondary priority
    preloadOnMount: true 
  });
};