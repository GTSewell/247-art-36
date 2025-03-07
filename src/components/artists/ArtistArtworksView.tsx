
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

  const artworksToShow = displayArtworks.slice(0, 4);

  return (
    <div className="h-full w-full flex items-center justify-center" data-no-flip="true">
      <div className="w-full h-full p-4" data-no-flip="true">
        {/* Force a 2x2 grid with !important to override any conflicting styles */}
        <div 
          className="!grid !grid-cols-2 gap-4 h-full" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
          data-no-flip="true"
        >
          {artworksToShow.length > 0 ? (
            artworksToShow.map((artwork, index) => (
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
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic">
              No artworks available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
