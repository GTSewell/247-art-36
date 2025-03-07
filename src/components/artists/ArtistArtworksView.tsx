
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

  // IMPORTANT: Force limit to exactly 4 artworks maximum
  const artworksToShow = displayArtworks.slice(0, 4);

  // If we have less than 4, pad the array with empty strings to maintain grid structure
  while (artworksToShow.length < 4) {
    artworksToShow.push('');
  }

  return (
    <div className="w-full h-full" data-no-flip="true">
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '1rem',
          padding: '1rem',
          width: '100%',
          height: '100%',
          maxHeight: '100%'
        }}
        data-testid="artwork-grid"
        data-no-flip="true"
      >
        {artworksToShow.map((artwork, index) => (
          <div 
            key={index} 
            style={{
              position: 'relative',
              aspectRatio: '1/1',
              borderRadius: '0.25rem',
              overflow: 'hidden',
              backgroundColor: artwork ? 'transparent' : '#f3f4f6'
            }}
            data-no-flip="true"
          >
            {artwork && (
              <img
                src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => handleArtworkImageError(e, index)}
                data-no-flip="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
