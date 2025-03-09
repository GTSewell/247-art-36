
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
        
        // First try to match the exact formatted name from the URL
        let { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .eq('published', true);
        
        if (artistError) {
          logger.error("Error fetching artist data:", artistError);
          throw artistError;
        }
        
        // Find the artist by comparing the formatted URL-safe name
        let foundArtist = null;
        if (artistData && artistData.length > 0) {
          foundArtist = artistData.find(artist => {
            const formattedName = artist.name
              .replace(/[^\w\s]/gi, '')
              .replace(/\s+/g, '')
              .toLowerCase();
            return formattedName === artistName.toLowerCase();
          });
        }
        
        if (foundArtist) {
          logger.info(`Found artist: ${foundArtist.name}, ID: ${foundArtist.id}`);
          const processedArtist: Artist = {
            ...foundArtist,
            techniques: typeof foundArtist.techniques === 'string' 
              ? JSON.parse(foundArtist.techniques) 
              : Array.isArray(foundArtist.techniques) ? foundArtist.techniques : [],
            styles: typeof foundArtist.styles === 'string' 
              ? JSON.parse(foundArtist.styles) 
              : Array.isArray(foundArtist.styles) ? foundArtist.styles : [],
            social_platforms: typeof foundArtist.social_platforms === 'string' 
              ? JSON.parse(foundArtist.social_platforms) 
              : Array.isArray(foundArtist.social_platforms) ? foundArtist.social_platforms : [],
            artworks: typeof foundArtist.artworks === 'string' 
              ? JSON.parse(foundArtist.artworks) 
              : Array.isArray(foundArtist.artworks) ? foundArtist.artworks : []
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
