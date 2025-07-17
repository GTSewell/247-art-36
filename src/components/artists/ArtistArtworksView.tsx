
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
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, artworkUrl?: string) => void;
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

  return (
    <div className="w-full h-auto">
      <div className="grid grid-cols-2 gap-1 max-h-fit">
        {processedArtworks.length > 0 ? (
          processedArtworks.map((artwork, index) => (
            <div 
              key={index} 
              className="relative rounded-md overflow-hidden bg-transparent"
              data-artwork-cell={`cell-${index}`}
            >
              <AspectRatio ratio={1} className="w-full">
                {!artworkErrors[index] ? (
                  <img
                    src={artwork}
                    alt={`Artwork ${index + 1} by ${artist.name}`}
                    className="w-full h-full object-contain bg-transparent"
                    onError={(e) => handleArtworkImageError(e, index, artwork)}
                    data-artwork-image={`image-${index}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-transparent">
                    <span className="text-muted-foreground text-sm">Image unavailable</span>
                  </div>
                )}
              </AspectRatio>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-4 text-center text-gray-500">
            No artworks available
          </div>
        )}
      </div>
    </div>
  );
};
