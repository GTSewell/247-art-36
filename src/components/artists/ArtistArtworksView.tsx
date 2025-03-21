
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { logger } from '@/utils/logger';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ArtistArtworksViewProps {
  artist: Artist;
  isGeneratingArtworks: boolean;
  setIsGeneratingArtworks: (value: boolean) => void;
  artworkErrors: Record<number, boolean>;
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => void;
  refreshArtworks?: () => void;
}

export const ArtistArtworksView: React.FC<ArtistArtworksViewProps> = ({
  artist,
  isGeneratingArtworks,
  setIsGeneratingArtworks,
  artworkErrors,
  handleArtworkImageError,
  refreshArtworks
}) => {
  // State to track processed artworks
  const [processedArtworks, setProcessedArtworks] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Process artist artworks with strict limitation to exactly 4
  useEffect(() => {
    let artworks: string[] = [];
    
    try {
      // Handle string or array format
      if (typeof artist.artworks === 'string') {
        try {
          const parsed = JSON.parse(artist.artworks);
          artworks = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          logger.error('Failed to parse artworks string:', error);
          artworks = [];
        }
      } else if (Array.isArray(artist.artworks)) {
        artworks = artist.artworks;
      }
      
      // Filter out empty or invalid URLs
      artworks = artworks.filter(url => url && typeof url === 'string' && url.trim() !== '');
      
      // Strictly limit to maximum 4 artworks
      artworks = artworks.slice(0, 4);
      
      // Log for debugging
      logger.info(`ArtistArtworksView: Processed ${artworks.length} artworks for artist ID ${artist.id}`);
      
      // Set the processed artworks
      setProcessedArtworks(artworks);
    } catch (error) {
      logger.error('Error processing artworks:', error);
      setProcessedArtworks([]);
    }
  }, [artist.artworks, artist.id]);

  // Create a fixed array of exactly 4 items
  // If we have less than 4 artworks, we'll fill the rest with empty strings
  const fixedArtworks = [...processedArtworks];
  while (fixedArtworks.length < 4) {
    fixedArtworks.push('');
  }

  // Strictly limit to exactly 4 artworks maximum
  const displayArtworks = fixedArtworks.slice(0, 4);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {displayArtworks.map((artwork, index) => (
          <div 
            key={index} 
            className="relative rounded-md overflow-hidden bg-gray-100"
            data-artwork-cell={`cell-${index}`}
          >
            <AspectRatio ratio={1} className="w-full">
              {artwork ? (
                <img
                  src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                  alt={`Artwork ${index + 1} by ${artist.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => handleArtworkImageError(e, index)}
                  data-artwork-image={`image-${index}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-sm">No artwork</span>
                </div>
              )}
            </AspectRatio>
          </div>
        ))}
      </div>
    </div>
  );
};
