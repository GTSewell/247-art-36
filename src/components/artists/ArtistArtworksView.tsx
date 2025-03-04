
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

  // Helper function to directly stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

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

  return (
    <div className="relative h-full">
      <div className="grid grid-cols-2 gap-2 p-2 w-full h-full pt-2">
        {displayArtworks.length > 0 ? (
          displayArtworks.slice(0, 4).map((artwork, index) => (
            <div key={index} className="relative aspect-square rounded overflow-hidden">
              <img
                src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover"
                onError={(e) => handleArtworkImageError(e, index)}
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
  );
};
