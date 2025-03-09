
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";

export function useArtistData(artistName: string | undefined) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        
        if (!artistName) {
          setLoading(false);
          return;
        }
        
        logger.info(`Fetching artist data for: ${artistName}`);
        
        // Try multiple query approaches to find the artist
        let artistData = null;
        let artistError = null;
        
        // 1. Try exact match (for no spaces)
        let result = await supabase
          .from('artists')
          .select('*')
          .eq('name', artistName)
          .eq('published', true)
          .maybeSingle();
          
        artistData = result.data;
        artistError = result.error;
        
        // 2. If not found, try with spaces re-added
        if (!artistData && artistName) {
          // Try adding spaces in common positions (before uppercase letters)
          const nameWithPossibleSpaces = artistName.replace(/([a-z])([A-Z])/g, '$1 $2');
          
          result = await supabase
            .from('artists')
            .select('*')
            .eq('name', nameWithPossibleSpaces)
            .eq('published', true)
            .maybeSingle();
            
          artistData = result.data;
          artistError = result.error;
        }
        
        // 3. If still not found, try case-insensitive search
        if (!artistData) {
          result = await supabase
            .from('artists')
            .select('*')
            .ilike('name', artistName.replace(/([A-Z])/g, ' $1').trim())
            .eq('published', true)
            .maybeSingle();
            
          artistData = result.data;
          artistError = result.error;
        }
        
        // 4. Try one more approach - removing all spaces and comparing
        if (!artistData) {
          // Get all artists and filter manually
          result = await supabase
            .from('artists')
            .select('*')
            .eq('published', true);
            
          const allArtists = result.data || [];
          
          // Find the artist whose name with spaces removed matches the artistName
          artistData = allArtists.find(a => 
            a.name.replace(/\s+/g, '').toLowerCase() === artistName.toLowerCase()
          );
        }
        
        if (artistError) {
          logger.error("Error fetching artist data:", artistError);
          throw artistError;
        }
        
        if (artistData) {
          logger.info(`Found artist: ${artistData.name}, ID: ${artistData.id}`);
          const processedArtist: Artist = {
            ...artistData,
            techniques: typeof artistData.techniques === 'string' 
              ? JSON.parse(artistData.techniques) 
              : Array.isArray(artistData.techniques) ? artistData.techniques : [],
            styles: typeof artistData.styles === 'string' 
              ? JSON.parse(artistData.styles) 
              : Array.isArray(artistData.styles) ? artistData.styles : [],
            social_platforms: typeof artistData.social_platforms === 'string' 
              ? JSON.parse(artistData.social_platforms) 
              : Array.isArray(artistData.social_platforms) ? artistData.social_platforms : [],
            artworks: typeof artistData.artworks === 'string' 
              ? JSON.parse(artistData.artworks) 
              : Array.isArray(artistData.artworks) ? artistData.artworks : []
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
          logger.warn(`No artist found with name: ${artistName}`);
        }
      } catch (error: any) {
        logger.error('Error fetching artist data:', error);
        toast.error(`Failed to load artist: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (artistName) {
      fetchArtistData();
    } else {
      setLoading(false);
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
