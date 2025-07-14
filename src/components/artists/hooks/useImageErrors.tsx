
import { useState } from 'react';
import { logger } from '@/utils/logger';

export const useImageErrors = (artistId: number, artistName: string) => {
  const [mainImageError, setMainImageError] = useState(false);
  const [artworkErrors, setArtworkErrors] = useState<Record<number, boolean>>({});

  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error(`Main image failed to load for artist ${artistId} (${artistName})`);
    setMainImageError(true);
    // Use a data URL for a simple gray placeholder
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zIDEwMCAxMzAgMTMxLjMgMTMwIDE3MFMxNjEuMyAyNDAgMjAwIDI0MFMyNzAgMjA4LjcgMjcwIDE3MFMyMzguNyAxMDAgMjAwIDEwMFpNMjAwIDIxMEMxNzguNSAyMTAgMTYwIDE5MS41IDE2MCAxNzBTMTc4LjUgMTMwIDIwMCAxMzBTMjQwIDE0OC41IDI0MCAxNzBTMjIxLjUgMjEwIDIwMCAyMTBaIiBmaWxsPSIjOUM5Q0EwIi8+CjxwYXRoIGQ9Ik0zMjAgMjcwSDgwVjMwMEgzMjBWMjcwWiIgZmlsbD0iIzlDOUNBMCIvPgo8L3N2Zz4K';
  };

  const handleArtworkImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, artworkUrl?: string) => {
    logger.error(`Artwork image ${index} failed to load for artist ${artistId} (${artistName}):`, artworkUrl || 'Unknown artwork');
    setArtworkErrors(prev => ({ ...prev, [index]: true }));
    // Use a data URL for a simple gray placeholder
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zIDEwMCAxMzAgMTMxLjMgMTMwIDE3MFMxNjEuMyAyNDAgMjAwIDI0MFMyNzAgMjA4LjcgMjcwIDE3MFMyMzguNyAxMDAgMjAwIDEwMFpNMjAwIDIxMEMxNzguNSAyMTAgMTYwIDE5MS41IDE2MCAxNzBTMTc4LjUgMTMwIDIwMCAxMzBTMjQwIDE0OC41IDI0MCAxNzBTMjIxLjUgMjEwIDIwMCAyMTBaIiBmaWxsPSIjOUM5Q0EwIi8+CjxwYXRoIGQ9Ik0zMjAgMjcwSDgwVjMwMEgzMjBWMjcwWiIgZmlsbD0iIzlDOUNBMCIvPgo8L3N2Zz4K';
  };

  return {
    mainImageError,
    artworkErrors,
    handleMainImageError,
    handleArtworkImageError
  };
};
