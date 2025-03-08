
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export function useArtistData(artistName: string | undefined) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (!artistName) return;
        
        setLoading(true);
        logger.info(`Fetching artist data for: ${artistName}`);
        
        // First, try to standardize the artist name that comes from the URL
        // URL slugs are usually lowercase with spaces removed
        const cleanedName = artistName.toLowerCase().trim();
        
        // Query the database with multiple ways to match the artist
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .or(`name.ilike.${cleanedName}%, name.ilike.%${cleanedName}%`)
          .limit(1);
        
        if (artistError) {
          logger.error('Error fetching artist data:', artistError);
          throw artistError;
        }
        
        // If not found, try a more flexible search
        if (!artistData || artistData.length === 0) {
          logger.info(`No exact match found, trying with more flexible pattern for: ${cleanedName}`);
          
          // Create a version of the name with spaces to try matching
          const possibleNameWithSpaces = cleanedName.replace(/([a-z])([A-Z])/g, '$1 $2');
          
          const { data: flexibleResults, error: flexibleError } = await supabase
            .from('artists')
            .select('*')
            .or(`name.ilike.%${cleanedName}%, name.ilike.%${possibleNameWithSpaces}%`)
            .limit(5);
            
          if (flexibleError) {
            logger.error('Error in flexible artist search:', flexibleError);
            throw flexibleError;
          }
          
          if (flexibleResults && flexibleResults.length > 0) {
            logger.info(`Found artist with flexible search: ${flexibleResults[0].name}`);
            artistData = flexibleResults;
          }
        }
        
        if (artistData && artistData.length > 0) {
          logger.info(`Found artist: ${artistData[0].name}`);
          
          const processedArtist: Artist = {
            ...artistData[0],
            techniques: typeof artistData[0].techniques === 'string' 
              ? JSON.parse(artistData[0].techniques) 
              : Array.isArray(artistData[0].techniques) ? artistData[0].techniques : [],
            styles: typeof artistData[0].styles === 'string' 
              ? JSON.parse(artistData[0].styles) 
              : Array.isArray(artistData[0].styles) ? artistData[0].styles : [],
            social_platforms: typeof artistData[0].social_platforms === 'string' 
              ? JSON.parse(artistData[0].social_platforms) 
              : Array.isArray(artistData[0].social_platforms) ? artistData[0].social_platforms : [],
            artworks: typeof artistData[0].artworks === 'string' 
              ? JSON.parse(artistData[0].artworks) 
              : Array.isArray(artistData[0].artworks) ? artistData[0].artworks : []
          };
          
          setArtist(processedArtist);
          
          const artworkBackground = processedArtist.artworks && 
            Array.isArray(processedArtist.artworks) && 
            processedArtist.artworks.length > 0 
              ? processedArtist.artworks[0] 
              : null;
          
          const defaultProfile: ArtistProfile = {
            id: '',
            artist_id: String(processedArtist.id), // Convert to string to match ArtistProfile type
            background_image: artworkBackground,
            background_color: '#f7cf1e',
            panel_color: '#ffffff',
            links: []
          };
          
          setProfile(defaultProfile);
        } else {
          logger.error(`Artist not found for: ${artistName}`);
          setArtist(null);
        }
      } catch (error: any) {
        console.error('Error fetching artist data:', error);
        toast.error(`Failed to load artist: ${error.message}`);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    if (artistName) {
      fetchArtistData();
    }
  }, [artistName]);

  // Helper functions to parse artist data
  const getArtistData = () => {
    if (!artist) return {
      techniques: [],
      styles: [],
      socialPlatforms: [],
      artworks: []
    };

    const techniques = Array.isArray(artist.techniques) 
      ? artist.techniques 
      : typeof artist.techniques === 'string' && artist.techniques
        ? JSON.parse(artist.techniques)
        : [];
    
    const styles = Array.isArray(artist.styles) 
      ? artist.styles 
      : typeof artist.styles === 'string' && artist.styles
        ? JSON.parse(artist.styles)
        : [];
    
    const socialPlatforms = Array.isArray(artist.social_platforms) 
      ? artist.social_platforms 
      : typeof artist.social_platforms === 'string' && artist.social_platforms
        ? JSON.parse(artist.social_platforms)
        : [];
    
    const artworks = Array.isArray(artist.artworks) 
      ? artist.artworks 
      : typeof artist.artworks === 'string' && artist.artworks
        ? JSON.parse(artist.artworks)
        : [];

    return { techniques, styles, socialPlatforms, artworks };
  };

  return {
    artist,
    profile,
    loading,
    getArtistData
  };
}
