
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { useIsMobile } from '@/hooks/use-mobile';
import { logger } from '@/utils/logger';
import { ArtistArtworksView } from './ArtistArtworksView';
import { useImageErrors } from './hooks/useImageErrors';
import { useArtistData } from './hooks/useArtistData';

interface ArtistImagePanelProps {
  artist: Artist;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  isFavorite: boolean;
  refreshArtists?: () => void;
  isMobile?: boolean;
}

const ArtistImagePanel: React.FC<ArtistImagePanelProps> = ({ 
  artist, 
  onFavoriteToggle, 
  isFavorite,
  refreshArtists,
  isMobile: propIsMobile
}) => {
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);
  const defaultIsMobile = useIsMobile();
  const isMobile = propIsMobile !== undefined ? propIsMobile : defaultIsMobile;
  
  // Custom hooks
  const { currentArtist, refreshArtist } = useArtistData(artist, refreshArtists);
  const { artworkErrors, handleArtworkImageError } = useImageErrors(artist.id, artist.name);

  // Log artist and artworks data
  useEffect(() => {
    logger.info(`ArtistImagePanel - Artist "${currentArtist.name}" (ID: ${currentArtist.id})`);
    logger.info(`ArtistImagePanel - Artist image: ${currentArtist.image || 'No image'}`);
    
    if (currentArtist.artworks) {
      const artworksCount = Array.isArray(currentArtist.artworks) 
        ? currentArtist.artworks.length 
        : typeof currentArtist.artworks === 'string' 
          ? 'String format, needs parsing' 
          : 'Unknown format';
      
      logger.info(`ArtistImagePanel - Artworks: ${artworksCount}`);
    } else {
      logger.info('ArtistImagePanel - No artworks available');
    }
  }, [currentArtist]);

  return (
    <div className="w-full">
      <ArtistArtworksView 
        artist={currentArtist}
        isGeneratingArtworks={isGeneratingArtworks}
        setIsGeneratingArtworks={setIsGeneratingArtworks}
        artworkErrors={artworkErrors}
        handleArtworkImageError={handleArtworkImageError}
        refreshArtworks={refreshArtist}
      />
    </div>
  );
};

export default ArtistImagePanel;
