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
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (artists) {
        // Filter or process artists as needed
        const featured = artists.filter((a, index) => index < 6); // First 6 as featured
        const additional = artists.filter((a, index) => index >= 6); // Rest as additional
        
        setFeaturedArtists(featured as Artist[]);
        setAdditionalArtists(additional as Artist[]);
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
      }
    } catch (error: any) {
      logger.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (artistId: number, isFavorite: boolean) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast.error('You must be logged in to favorite artists');
        return;
      }
      
      if (isFavorite) {
        // Remove from favorites
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
      } else {
        // Add to favorites
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
      }
    } catch (error: any) {
      logger.error('Error toggling favorite:', error);
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  };

  // Improved refreshArtists function that refreshes a single artist if specified
  const refreshArtists = async (artistId?: number): Promise<void> => {
    if (artistId) {
      try {
        // Fetch the specific artist data
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('id', artistId)
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
    }
  };

  return {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists
  };
};
