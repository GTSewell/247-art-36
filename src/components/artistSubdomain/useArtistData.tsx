
import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";
import { findArtistByName } from './utils/artistSearchStrategies';
import { processArtistData, createDefaultProfile, extractArtistData } from './utils/artistDataProcessor';

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
        
        // Use our search strategies to find the artist
        const { artistData, artistError } = await findArtistByName(artistName);
        
        if (artistError) {
          logger.error("Error fetching artist data:", artistError);
          throw artistError;
        }
        
        if (artistData) {
          // Process the artist data
          const processedArtist = processArtistData(artistData);
          
          if (processedArtist) {
            setArtist(processedArtist);
            
            // Create a default profile
            const defaultProfile = createDefaultProfile(processedArtist);
            setProfile(defaultProfile);
          }
        } else {
          logger.warn(`No artist found with name: ${artistName}`);
          logger.error(`Artist not found: ${artistName}`);
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

  // Helper function to parse artist data
  const getArtistData = () => extractArtistData(artist);

  return {
    artist,
    profile,
    loading,
    getArtistData
  };
}
