
import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useArtistData = (initialArtist: Artist, refreshArtists?: () => void) => {
  const [currentArtist, setCurrentArtist] = useState<Artist>(initialArtist);
  
  // Update current artist when artist prop changes
  useEffect(() => {
    // Create a copy of the artist to modify
    const artistCopy = {...initialArtist};

    // Ensure artworks are parsed and limited to 4 items
    if (artistCopy.artworks) {
      // Parse string artworks
      if (typeof artistCopy.artworks === 'string') {
        try {
          const parsed = JSON.parse(artistCopy.artworks);
          artistCopy.artworks = Array.isArray(parsed) ? parsed.slice(0, 4) : [];
        } catch (error) {
          logger.error('Error parsing artworks:', error);
          artistCopy.artworks = [];
        }
      }
      // Limit array artworks
      else if (Array.isArray(artistCopy.artworks)) {
        artistCopy.artworks = artistCopy.artworks.slice(0, 4);
      }
    }

    // Log the processed artworks for debugging
    logger.info(`ArtistImagePanel - Processed artist "${artistCopy.name}" (ID: ${artistCopy.id}) with ${Array.isArray(artistCopy.artworks) ? artistCopy.artworks.length : 0} artworks`);
    
    // Update state with processed artist
    setCurrentArtist(artistCopy);
  }, [initialArtist]);

  // Refresh artist data from supabase
  const refreshArtist = async () => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', initialArtist.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const artistData = data as Artist;
        
        // Process artworks to ensure we only have at most 4
        if (artistData.artworks) {
          if (typeof artistData.artworks === 'string') {
            try {
              const parsed = JSON.parse(artistData.artworks);
              artistData.artworks = Array.isArray(parsed) ? parsed.slice(0, 4) : [];
            } catch {
              artistData.artworks = [];
            }
          } else if (Array.isArray(artistData.artworks)) {
            artistData.artworks = artistData.artworks.slice(0, 4);
          }
        }
        
        // Log the refreshed artist data
        logger.info(`Refreshed artist data for ID ${initialArtist.id}: ${artistData.name} with ${Array.isArray(artistData.artworks) ? artistData.artworks.length : 0} artworks`);
        
        setCurrentArtist(artistData);
        
        // If parent component has a refresh function, call it too
        if (refreshArtists) {
          refreshArtists();
        }
      }
    } catch (error) {
      logger.error('Error refreshing artist data:', error);
    }
  };

  return { currentArtist, refreshArtist };
};
