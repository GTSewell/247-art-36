
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Artist } from "@/data/types/artist";
import { logger } from "@/utils/logger";

export const useArtists = () => {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [additionalArtists, setAdditionalArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      
      // First, get the current featured artists rotation
      const { data: rotationData, error: rotationError } = await supabase
        .from('featured_artists_rotation')
        .select('artist_ids')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let featuredArtistIds = [24, 26, 31]; // Default fallback
      
      if (rotationData && !rotationError) {
        featuredArtistIds = rotationData.artist_ids;
        logger.info('Using rotated featured artists:', featuredArtistIds);
      } else {
        logger.info('Using default featured artists (rotation not found):', featuredArtistIds);
      }

      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('published', true)
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (artists) {
        // Filter out the featured artists
        const featured = artists.filter(artist => 
          featuredArtistIds.includes(artist.id)
        );
        
        // All other artists go to additional
        const additional = artists.filter(artist => 
          !featuredArtistIds.includes(artist.id)
        );
        
        // Sort featured artists to match the requested order
        const sortedFeatured = [...featured].sort((a, b) => {
          return featuredArtistIds.indexOf(a.id) - featuredArtistIds.indexOf(b.id);
        });
        
        // Sort additional artists to show newest artists first (highest ID first)
        const sortedAdditional = [...additional].sort((a, b) => {
          // If both are signature artists or both are not, sort by ID descending
          if ((a.id >= 26 && b.id >= 26) || (a.id < 26 && b.id < 26)) {
            // Sort by ID in descending order (highest/newest first)
            return b.id - a.id;
          }
          // Signature artists still come first
          return a.id >= 26 ? -1 : 1;
        });
        
        setFeaturedArtists(sortedFeatured as Artist[]);
        setAdditionalArtists(sortedAdditional as Artist[]);
      }
    } catch (error: any) {
      logger.error('Error fetching artists:', error);
      toast.error(`Failed to load artists: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('favorite_artists')
        .select('artist_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        const favoriteIds = new Set(data.map(fav => fav.artist_id));
        setFavoriteArtists(favoriteIds);
        logger.info(`Fetched favorites: ${Array.from(favoriteIds).join(', ')}`);
      }
    } catch (error: any) {
      logger.error('Error fetching favorites:', error);
    }
  };

  const handleFavoriteToggle = async (artistId: number, isFavorite: boolean) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast.error('You must be logged in to favorite artists');
        return;
      }
      
      logger.info(`Toggling favorite: artistId=${artistId}, isFavorite=${isFavorite}, current favorites=${Array.from(favoriteArtists).join(',')}`);
      
      if (isFavorite) {
        // Add to favorites (parameter represents the NEW state we want)
        const { error } = await supabase
          .from('favorite_artists')
          .insert({ user_id: user.id, artist_id: artistId });
        
        if (error) throw error;
        
        setFavoriteArtists(prev => {
          const newSet = new Set(prev);
          newSet.add(artistId);
          return newSet;
        });
        
        toast.success('Added to favorites');
        logger.info(`Added artist ${artistId} to favorites`);
      } else {
        // Remove from favorites (parameter represents the NEW state we want)
        const { error } = await supabase
          .from('favorite_artists')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_id', artistId);
        
        if (error) throw error;
        
        setFavoriteArtists(prev => {
          const newSet = new Set(prev);
          newSet.delete(artistId);
          return newSet;
        });
        
        toast.success('Removed from favorites');
        logger.info(`Removed artist ${artistId} from favorites`);
      }
    } catch (error: any) {
      logger.error('Error toggling favorite:', error);
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  };

  const refreshArtists = async (artistId?: number): Promise<void> => {
    if (artistId) {
      try {
        // Fetch the specific artist data
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('id', artistId)
          .eq('published', true)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Update the artist in the featured/additional artists arrays
          setFeaturedArtists(prev => 
            prev.map(artist => artist.id === artistId ? data as Artist : artist)
          );
          
          setAdditionalArtists(prev => 
            prev.map(artist => artist.id === artistId ? data as Artist : artist)
          );
        }
      } catch (error: any) {
        logger.error('Error refreshing specific artist:', error);
        toast.error(`Failed to refresh artist: ${error.message}`);
      }
    } else {
      // Refresh all artists
      await fetchArtists();
      await fetchFavorites();
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchFavorites();
  }, []);

  return {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists
  };
};
