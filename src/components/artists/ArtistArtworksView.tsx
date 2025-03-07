
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface ArtistArtworksViewProps {
  artist: Artist;
  isGeneratingArtworks: boolean;
  setIsGeneratingArtworks: (value: boolean) => void;
  artworkErrors: Record<number, boolean>;
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => void;
  refreshArtworks?: () => void; // Optional prop to refresh artworks without page reload
}

export const ArtistArtworksView: React.FC<ArtistArtworksViewProps> = ({
  artist,
  isGeneratingArtworks,
  setIsGeneratingArtworks,
  artworkErrors,
  handleArtworkImageError,
  refreshArtworks
}) => {
  const [generatedArtworks, setGeneratedArtworks] = useState<string[]>([]);

  // Helper function to parse artworks if they're stored as a string
  const getArtworks = (): string[] => {
    if (!artist.artworks) return [];
    
    if (typeof artist.artworks === 'string') {
      try {
        return JSON.parse(artist.artworks);
      } catch {
        return [];
      }
    }
    
    return Array.isArray(artist.artworks) ? artist.artworks : [];
  };

  // Determine which artworks to display
  const displayArtworks = generatedArtworks.length > 0 
    ? generatedArtworks 
    : getArtworks();
  
  // For debugging - log the number of artworks
  useEffect(() => {
    logger.info(`ArtistArtworksView - Total artworks: ${displayArtworks.length}, Displaying: ${Math.min(4, displayArtworks.length)}`);
  }, [displayArtworks]);

  // IMPORTANT: Limit to exactly 4 artworks for a 2x2 grid
  const artworksToShow = displayArtworks.slice(0, 4);

  return (
    <div className="w-full h-full" data-no-flip="true">
      {artworksToShow.length > 0 ? (
        <div 
          className="w-full h-full grid grid-cols-2 gap-4 p-4" 
          style={{ 
            display: 'grid !important', 
            gridTemplateColumns: 'repeat(2, 1fr) !important',
            gridTemplateRows: 'repeat(2, 1fr)',
          }}
          data-testid="artwork-grid"
          data-no-flip="true"
        >
          {artworksToShow.map((artwork, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded overflow-hidden"
              data-no-flip="true"
            >
              <img
                src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover"
                onError={(e) => handleArtworkImageError(e, index)}
                data-no-flip="true"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm italic">
          No artworks available
        </div>
      )}
    </div>
  );
};
