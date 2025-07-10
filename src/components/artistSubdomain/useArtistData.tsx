
import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";
import { findArtistByName } from './utils/artistSearchStrategies';
import { processArtistData, createDefaultProfile, extractArtistData } from './utils/artistDataProcessor';
import { fetchArtistProfileLinks } from '@/components/pwa/artist-settings/api/fetch/fetchArtistProfileLinks';

export function useArtistData(artistName: string | undefined) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        
        if (!artistName || artistName.trim() === '') {
          logger.warn("Artist name is undefined or empty, cannot fetch artist data");
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
            
            // Try to load artist profile links from the new table
            try {
              const { data: links } = await fetchArtistProfileLinks(processedArtist.id.toString());
              
              // Create profile with real links if available
              const defaultProfile = createDefaultProfile(processedArtist);
              if (links && links.length > 0) {
                defaultProfile.links = links;
              }
              setProfile(defaultProfile);
            } catch (error) {
              logger.warn("Could not load artist profile links (table may not exist yet):", error);
              // Create a default profile without links
              const defaultProfile = createDefaultProfile(processedArtist);
              setProfile(defaultProfile);
            }
          }
        } else {
          logger.warn(`No artist found with name: ${artistName}`);
          toast.error(`Artist not found: ${artistName}`);
        }
      } catch (error: any) {
        logger.error('Error fetching artist data:', error);
        toast.error(`Failed to load artist: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
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
