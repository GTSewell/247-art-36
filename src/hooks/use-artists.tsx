
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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsAdmin(!!data);
      }
    };
    
    checkUserRole();
  }, []);

  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      
      // Only fetch published artists
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('published', true)
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (artists && artists.length > 0) {
        logger.info(`Fetched ${artists.length} artists from database`);
        
        // Predefined artists for featured section - these should be the "featured" artists you specifically want to highlight
        // All other published artists will go to "additional" section
        const featuredArtistNames = ['Sarah', 'Marcus', 'Elena']; // Add your featured artist names here
        
        // First, filter artists that should go to featured section (only the predefined ones)
        const featured = artists.filter(artist => 
          featuredArtistNames.includes(artist.name)
        );
        
        // All other artists go to the additional section
        const additional = artists.filter(artist => 
          !featuredArtistNames.includes(artist.name)
        );
        
        logger.info(`Featured artists: ${featured.map(a => a.name).join(', ')}`);
        logger.info(`Additional artists: ${additional.map(a => a.name).join(', ')}`);
        
        setFeaturedArtists(featured as Artist[]);
        setAdditionalArtists(additional as Artist[]);
        logger.info(`Set ${featured.length} featured artists and ${additional.length} additional artists`);
      } else {
        logger.warn('No published artists found in the database');
        setFeaturedArtists([]);
        setAdditionalArtists([]);
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
    }
  };

  return {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists,
    isAdmin
  };
};
