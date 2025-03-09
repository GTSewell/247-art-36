import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';

export function useArtists() {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

  // Hardcoded list of featured artist IDs
  const featuredArtistIds = [1, 2, 3, 4, 5]; // First 5 artists are featured

  useEffect(() => {
    fetchArtists();
    // You would also fetch favorite artists here if user is logged in
  }, []);

  const fetchArtists = async (artistId?: number) => {
    try {
      setLoading(true);
      
      // If artistId is provided, fetch only that artist
      const query = supabase
        .from('artists')
        .select('*')
        .is('published', true); // Only get published artists
      
      if (artistId) {
        query.eq('id', artistId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Process the data to ensure correct types
        const processedArtists: Artist[] = data.map(artist => ({
          ...artist,
          id: artist.id,
          name: artist.name || 'Unknown Artist',
          specialty: artist.specialty || '',
          image: artist.image || '/placeholder.svg',
          bio: artist.bio || '',
          location: artist.location || '',
          city: artist.city || '',
          country: artist.country || '',
          techniques: Array.isArray(artist.techniques) ? artist.techniques.map(String) : [],
          styles: Array.isArray(artist.styles) ? artist.styles.map(String) : [],
          social_platforms: Array.isArray(artist.social_platforms) ? artist.social_platforms.map(String) : [],
          artworks: Array.isArray(artist.artworks) ? artist.artworks.map(String) : [],
          locked_artworks: artist.locked_artworks || false,
          published: artist.published || false,
          user_id: artist.user_id || ''
        }));
        
        if (artistId) {
          // If we're refreshing a specific artist, only update that one in the state
          setArtists(prev => prev.map(a => a.id === artistId ? processedArtists[0] : a));
          setFeaturedArtists(prev => prev.map(a => a.id === artistId ? processedArtists[0] : a));
        } else {
          // Otherwise update all artists
          setArtists(processedArtists);
          
          // Set featured artists (first 5 or all if less than 5)
          const featured = processedArtists.filter(artist => featuredArtistIds.includes(artist.id));
          setFeaturedArtists(featured.length > 0 ? featured : processedArtists.slice(0, Math.min(5, processedArtists.length)));
        }
      }
    } catch (error: any) {
      console.error('Error fetching artists:', error);
      toast.error(`Failed to load artists: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (artistId: number, isFavorite: boolean) => {
    const newFavorites = new Set(favoriteArtists);
    
    if (isFavorite) {
      newFavorites.add(artistId);
    } else {
      newFavorites.delete(artistId);
    }
    
    setFavoriteArtists(newFavorites);
    
    // Here you would also update the favorites in the database if user is logged in
  };

  return {
    loading,
    artists,
    featuredArtists,
    favoriteArtists,
    toggleFavorite,
    refreshArtists: fetchArtists
  };
}
