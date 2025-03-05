
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';

export function useArtistData(artistName: string | undefined) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        
        const formattedName = artistName?.replace(/([A-Z])/g, ' $1').trim();
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .ilike('name', formattedName || '')
          .single();
        
        if (artistError) throw artistError;
        
        if (artistData) {
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
            artist_id: processedArtist.id,
            background_image: artworkBackground,
            background_color: '#f7cf1e',
            panel_color: '#ffffff',
            links: []
          };
          
          setProfile(defaultProfile);
        }
      } catch (error: any) {
        console.error('Error fetching artist data:', error);
        toast.error(`Failed to load artist: ${error.message}`);
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
