
import { useState } from 'react';
import { logger } from '@/utils/logger';

export const useImageErrors = (artistId: number, artistName: string) => {
  const [mainImageError, setMainImageError] = useState(false);
  const [artworkErrors, setArtworkErrors] = useState<Record<number, boolean>>({});

  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error(`Main image failed to load for artist ${artistId} (${artistName})`);
    setMainImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleArtworkImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, artworkUrl?: string) => {
    logger.error(`Artwork image ${index} failed to load for artist ${artistId} (${artistName}):`, artworkUrl || 'Unknown artwork');
    setArtworkErrors(prev => ({ ...prev, [index]: true }));
    e.currentTarget.src = '/placeholder.svg';
  };

  return {
    mainImageError,
    artworkErrors,
    handleMainImageError,
    handleArtworkImageError
  };
};
