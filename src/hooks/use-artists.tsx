
import { useState, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useArtists = () => {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [additionalArtists, setAdditionalArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

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
        const transformedArtists = artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          specialty: artist.specialty,
          image: artist.image,
          bio: artist.bio,
          location: artist.location,
          techniques: artist.techniques,
          styles: artist.styles,
          social_platforms: artist.social_platforms
        }));

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
    handleFavoriteToggle,
    refreshArtists: loadArtists
  };
};
