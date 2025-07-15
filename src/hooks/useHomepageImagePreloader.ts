import { useSequentialFlashPreloader } from './useSequentialFlashPreloader';

// Homepage accordion images in order from top to bottom
const HOMEPAGE_IMAGES = [
  '/lovable-uploads/551c72b7-11f2-4153-bf51-4562bc1a965c.png', // Hero
  '/lovable-uploads/8e976936-1c21-424f-86b2-36cfecc6eacd.png', // Artists
  '/lovable-uploads/0e792c6e-d4f2-45f3-9de6-f1c897a07f79.png', // Gallery
  '/lovable-uploads/43e84cb6-186e-4f87-9513-3625b6a312dd.png', // Events
  '/lovable-uploads/72e52037-cd09-40b1-8993-ea48e64c2f6f.png', // Print
  '/lovable-uploads/6a02808c-6f26-4b2b-81ca-342a5be9d9b9.png', // Services
];

export const useHomepageImagePreloader = () => {
  return useSequentialFlashPreloader(HOMEPAGE_IMAGES, {
    flashDuration: 150,
    delayBetweenImages: 100,
    startOnMount: true
  });
};