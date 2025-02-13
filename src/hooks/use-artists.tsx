
import { useState, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ArtistRow = Database['public']['Tables']['artists']['Row'];

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
      console.error('Error loading favorites:', error);
      return;
    }

    setFavoriteArtists(new Set(favorites.map(f => f.artist_id)));
  };

  const transformArtist = (artist: ArtistRow): Artist => {
    // Parse JSON fields, ensuring they're arrays even if null/undefined
    const techniques = Array.isArray(artist.techniques) ? artist.techniques : [];
    const styles = Array.isArray(artist.styles) ? artist.styles : [];
    const social_platforms = Array.isArray(artist.social_platforms) ? artist.social_platforms : [];
    const artworks = Array.isArray(artist.artworks) ? artist.artworks : [];

    console.log('Transforming artist:', {
      id: artist.id,
      name: artist.name,
      techniques,
      styles,
      social_platforms,
      artworks
    });

    return {
      id: artist.id,
      name: artist.name || '',
      specialty: artist.specialty || '',
      image: artist.image || '',
      bio: artist.bio || '',
      location: artist.location || '',
      city: artist.city || '',
      country: artist.country || '',
      techniques: techniques as string[],
      styles: styles as string[],
      social_platforms: social_platforms as string[],
      artworks: artworks as string[],
      locked_artworks: artist.locked_artworks || false
    };
  };

  const loadArtists = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching artists from Supabase...');
      
      const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error loading artists:', error);
        toast.error('Failed to load artists');
        return;
      }

      if (artists) {
        console.log('Artists loaded:', artists.length);
        const transformedArtists = artists.map(transformArtist);
        console.log('Transformed artists:', transformedArtists);

        // First 3 artists are featured
        setFeaturedArtists(transformedArtists.slice(0, 3));
        // Rest are additional artists
        setAdditionalArtists(transformedArtists.slice(3));
      }
    } catch (error) {
      console.error('Error in loadArtists:', error);
      toast.error('Failed to load artists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
    loadFavorites();

    // Subscribe to auth changes to reload favorites
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadFavorites();
    });

    // Subscribe to database changes
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
    };
  }, []);

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
      console.error('Error toggling favorite:', error);
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
