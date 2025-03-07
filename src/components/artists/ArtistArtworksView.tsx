
import React from 'react';
import { Artist } from '@/data/types/artist';
import { logger } from '@/utils/logger';

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
  artworkErrors,
  handleArtworkImageError
}) => {
  // State to track processed artworks
  const [processedArtworks, setProcessedArtworks] = React.useState<string[]>([]);

  // Process artist artworks with strict limitation to exactly 4
  React.useEffect(() => {
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
  const fixedArtworks = Array(4).fill('').map((_, i) => processedArtworks[i] || '');

  return (
    <div className="w-full h-full p-4">
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-full p-4">
          <div className="grid grid-cols-2 gap-2 h-full">
            {fixedArtworks.map((artwork, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded overflow-hidden"
                data-artwork-cell={`cell-${index}`}
              >
                {artwork && (
                  <img
                    src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                    alt={`Artwork ${index + 1} by ${artist.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => handleArtworkImageError(e, index)}
                    data-artwork-image={`image-${index}`}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
