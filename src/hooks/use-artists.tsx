
import { useState, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useArtists = () => {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [additionalArtists, setAdditionalArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setIsLoading(true);
        const { data: artists, error } = await supabase
          .from('artists')
          .select('*')
          .order('id');

        if (error) {
          toast.error('Failed to load artists');
          console.error('Error loading artists:', error);
          return;
        }

        if (artists) {
          // First 3 artists are featured
          setFeaturedArtists(artists.slice(0, 3));
          // Rest are additional artists
          setAdditionalArtists(artists.slice(3));
        }
      } catch (error) {
        console.error('Error in loadArtists:', error);
        toast.error('Failed to load artists');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtists();
  }, []);

  const handleFavoriteToggle = (artistId: number, isFavorite: boolean) => {
    setFavoriteArtists(prev => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(artistId);
        toast.success('Added to favorites');
      } else {
        newFavorites.delete(artistId);
        toast.success('Removed from favorites');
      }
      return newFavorites;
    });
  };

  return {
    featuredArtists,
    additionalArtists,
    isLoading,
    favoriteArtists,
    handleFavoriteToggle
  };
};
