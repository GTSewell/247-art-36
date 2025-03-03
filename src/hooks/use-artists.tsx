import { useState, useEffect, useCallback } from "react";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { transformArtist } from "@/utils/artist-transformer";
import { logger } from "@/utils/logger";

export const useArtists = () => {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [additionalArtists, setAdditionalArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

  const loadFavorites = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data: favorites, error } = await supabase
      .from('favorite_artists')
      .select('artist_id')
      .eq('user_id', session.session.user.id);

    if (error) {
      logger.error('Error loading favorites:', error);
      return;
    }

    setFavoriteArtists(new Set(favorites.map(f => f.artist_id)));
  };

  const processImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return '/placeholder.svg';
    }
    
    if (imageUrl.startsWith('/') || imageUrl.includes('placeholder')) {
      return imageUrl;
    }
    
    if (imageUrl.includes('runware.ai') || imageUrl.includes('im.runware')) {
      return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e';
    }
    
    return imageUrl;
  };
  
  const processArtworkUrls = (artworks: string[] | null): string[] => {
    if (!artworks || !Array.isArray(artworks) || artworks.length === 0) {
      return ['/placeholder.svg'];
    }
    
    return artworks.map(artwork => {
      if (!artwork || artwork.trim() === '') {
        return '/placeholder.svg';
      }
      
      if (artwork.startsWith('/') || artwork.includes('placeholder')) {
        return artwork;
      }
      
      if (artwork.includes('runware.ai') || artwork.includes('im.runware')) {
        const placeholders = [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
        ];
        return placeholders[Math.floor(Math.random() * placeholders.length)];
      }
      
      return artwork;
    });
  };

  const loadArtists = useCallback(async () => {
    try {
      setIsLoading(true);
      logger.info('Fetching artists from Supabase...');
      
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('id');

      if (error) {
        logger.error('Error loading artists:', error);
        toast.error('Failed to load artists');
        return;
      }

      if (artists) {
        logger.info('Artists data received', { count: artists.length });
        let transformedArtists = artists.map(transformArtist);
        
        transformedArtists = transformedArtists.map(artist => ({
          ...artist,
          image: processImageUrl(artist.image),
          artworks: processArtworkUrls(artist.artworks),
        }));
        
        logger.info('Artists transformed successfully with fixed images', { count: transformedArtists.length });

        setFeaturedArtists(transformedArtists.slice(0, 3));
        setAdditionalArtists(transformedArtists.slice(3));
      }
    } catch (error) {
      logger.error('Error in loadArtists:', error);
      toast.error('Failed to load artists');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
    loadFavorites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadFavorites();
    });

    const handleRefreshArtists = () => {
      logger.info('Refresh artists event received');
      loadArtists();
    };
    window.addEventListener('refreshArtists', handleRefreshArtists);

    const artistsSubscription = supabase
      .channel('artists_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'artists'
      }, () => {
        loadArtists();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      artistsSubscription.unsubscribe();
      window.removeEventListener('refreshArtists', handleRefreshArtists);
    };
  }, [loadArtists]);

  const handleFavoriteToggle = async (artistId: number, isFavorite: boolean) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast.error('Please log in to favorite artists');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_artists')
          .insert({ 
            user_id: session.session.user.id,
            artist_id: artistId 
          });

        if (error) throw error;

        setFavoriteArtists(prev => new Set([...prev, artistId]));
        toast.success('Added to favorites');
      } else {
        const { error } = await supabase
          .from('favorite_artists')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('artist_id', artistId);

        if (error) throw error;

        setFavoriteArtists(prev => {
          const newSet = new Set(prev);
          newSet.delete(artistId);
          return newSet;
        });
        toast.success('Removed from favorites');
      }
    } catch (error) {
      logger.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle,
    refreshArtists: loadArtists
  };
};
