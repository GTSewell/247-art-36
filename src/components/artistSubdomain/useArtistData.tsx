
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
        
        const formattedName = artistName.replace(/([A-Z])/g, ' $1').trim();
        logger.info(`Fetching artist data for: ${formattedName}`);
        
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('*')
          .ilike('name', formattedName)
          .maybeSingle();
        
        if (artistError) {
          logger.error("Error fetching artist data:", artistError);
          throw artistError;
        }
        
        if (artistData) {
          logger.info(`Found artist: ${artistData.name}, ID: ${artistData.id}`);
          
          // Create a safe default artist object with all required fields
          const defaultArtist: Artist = {
            id: 0,
            name: '',
            specialty: '',
            image: '/placeholder.svg',
            bio: '',
            techniques: [],
            styles: [],
            social_platforms: [],
            artworks: []
          };
          
          // Merge with the data we got
          const processedArtist: Artist = {
            ...defaultArtist,
            ...artistData,
            // Parse string fields or provide empty arrays
            techniques: parseSafeJsonArray(artistData.techniques),
            styles: parseSafeJsonArray(artistData.styles),
            social_platforms: parseSafeJsonArray(artistData.social_platforms),
            artworks: parseSafeJsonArray(artistData.artworks)
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
          logger.warn(`No artist found with name: ${formattedName}`);
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

  // Helper function to safely parse JSON arrays
  const parseSafeJsonArray = (value: any): any[] => {
    if (Array.isArray(value)) {
      return value;
    } 
    if (typeof value === 'string' && value) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        logger.error('Error parsing JSON array:', error);
        return [];
      }
    }
    return [];
  };

  // Helper functions to parse artist data
  const getArtistData = () => {
    if (!artist) return {
      techniques: [],
      styles: [],
      socialPlatforms: {},
      artworks: []
    };

    // Parse social platforms to create a Record from array
    const socialPlatformsRecord: Record<string, string> = {};
    if (Array.isArray(artist.social_platforms)) {
      artist.social_platforms.forEach(platform => {
        if (typeof platform === 'object' && platform !== null) {
          const entries = Object.entries(platform);
          if (entries.length > 0) {
            const [key, value] = entries[0];
            socialPlatformsRecord[key] = value as string;
          }
        }
      });
    }

    return {
      techniques: parseSafeJsonArray(artist.techniques),
      styles: parseSafeJsonArray(artist.styles),
      socialPlatforms: socialPlatformsRecord,
      artworks: parseSafeJsonArray(artist.artworks)
    };
  };

  return {
    artist,
    profile,
    loading,
    getArtistData
  };
}
