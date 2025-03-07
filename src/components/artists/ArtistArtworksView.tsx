
import React, { useState } from 'react';
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

  // Duplicate artworks if needed to fill a 2x3 grid (6 items)
  const getArtworksForGrid = (): string[] => {
    if (displayArtworks.length === 0) return [];
    
    if (displayArtworks.length >= 6) {
      return displayArtworks.slice(0, 6);
    }
    
    // Create a new array to avoid modifying the original
    const artworksCopy = [...displayArtworks];
    
    // Keep duplicating the existing artworks until we have 6 items
    while (artworksCopy.length < 6) {
      const index = artworksCopy.length % displayArtworks.length;
      artworksCopy.push(displayArtworks[index]);
    }
    
    return artworksCopy;
  };

  const gridArtworks = getArtworksForGrid();

  return (
    <div className="h-full w-full" data-no-flip="true">
      <div className="grid grid-cols-3 grid-rows-2 h-full gap-0" data-no-flip="true">
        {gridArtworks.length > 0 ? (
          gridArtworks.map((artwork, index) => (
            <div 
              key={index} 
              className="aspect-square overflow-hidden"
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
          <div className="col-span-3 row-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic">
            No artworks available
          </div>
        )}
      </div>
    </div>
  );
};
