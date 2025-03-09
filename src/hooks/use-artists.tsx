
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Artist } from '@/data/types/artist';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export function useArtists() {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchArtists();
    // You would also fetch favorite artists here if user is logged in
  }, []);

  const fetchArtists = async (artistId?: number) => {
    try {
      setLoading(true);
      logger.info("Fetching artists from Supabase");
      
      let query = supabase
        .from('artists')
        .select('*');
      
      // If artistId is provided, only fetch that specific artist
      if (artistId) {
        query = query.eq('id', artistId);
      } else {
        // When fetching all artists, only get published ones
        query = query.eq('published', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      logger.info(`Fetched ${data?.length || 0} artists from Supabase`);
      
      if (data) {
        // Process the data to ensure correct types
        const processedArtists: Artist[] = data.map(artist => ({
          id: artist.id,
          name: artist.name || 'Unknown Artist',
          specialty: artist.specialty || '',
          image: artist.image || '/placeholder.svg',
          bio: artist.bio || '',
          location: artist.location || '',
          city: artist.city || '',
          country: artist.country || '',
          // Convert Json[] to string[] for these fields
          techniques: Array.isArray(artist.techniques) 
            ? artist.techniques.map((item: any) => String(item)) 
            : [],
          styles: Array.isArray(artist.styles) 
            ? artist.styles.map((item: any) => String(item)) 
            : [],
          social_platforms: Array.isArray(artist.social_platforms) 
            ? artist.social_platforms.map((item: any) => String(item)) 
            : [],
          artworks: Array.isArray(artist.artworks) 
            ? artist.artworks.map((item: any) => String(item)) 
            : [],
          locked_artworks: artist.locked_artworks || false
        }));
        
        logger.info(`Processed ${processedArtists.length} artists`);
        
        if (artistId) {
          // If we're updating just one artist, replace it in the current list
          setArtists(prev => {
            const newList = [...prev];
            const index = newList.findIndex(a => a.id === artistId);
            if (index !== -1 && processedArtists.length > 0) {
              newList[index] = processedArtists[0];
            }
            return newList;
          });
        } else {
          // Otherwise update the full list
          setArtists(processedArtists);
          
          // Currently we're not featuring any specific artists
          setFeaturedArtists([]);
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
