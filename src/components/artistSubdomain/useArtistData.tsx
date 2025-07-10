
import { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ArtistProfile } from '@/data/types/artistProfile';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";
import { findArtistByName } from './utils/artistSearchStrategies';
import { processArtistData, createDefaultProfile, extractArtistData } from './utils/artistDataProcessor';
import { fetchArtistProfileLinks } from '@/components/pwa/artist-settings/api/fetch/fetchArtistProfileLinks';
import { supabase } from '@/integrations/supabase/client';

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
            
            // Try to load artist profile data and assigned products
            try {
              const [linksResult, profileResult, productsResult] = await Promise.allSettled([
                fetchArtistProfileLinks(processedArtist.id.toString()),
                supabase
                  .from('artist_profiles')
                  .select('background_image, background_color, panel_color')
                  .eq('artist_id', processedArtist.id)
                  .maybeSingle(),
                supabase
                  .from('products')
                  .select('id, name, price, image_url, category')
                  .eq('artist_id', processedArtist.id)
                  .order('created_at', { ascending: false })
              ]);
              
              // Create profile with real data if available
              const defaultProfile = createDefaultProfile(processedArtist);
              
              // Add links if available
              if (linksResult.status === 'fulfilled' && linksResult.value.data && linksResult.value.data.length > 0) {
                defaultProfile.links = linksResult.value.data;
              }
              
              // Add profile data (background image, colors) if available
              if (profileResult.status === 'fulfilled' && profileResult.value.data) {
                const profileData = profileResult.value.data;
                if (profileData.background_image) {
                  defaultProfile.background_image = profileData.background_image;
                }
                if (profileData.background_color) {
                  defaultProfile.background_color = profileData.background_color;
                }
                if (profileData.panel_color) {
                  defaultProfile.panel_color = profileData.panel_color;
                }
              }
              
              // Add assigned products to artworks if available
              if (productsResult.status === 'fulfilled' && productsResult.value.data && productsResult.value.data.length > 0) {
                const productImages = productsResult.value.data
                  .filter(product => product.image_url)
                  .map(product => product.image_url);
                
                // Combine existing artworks with product images
                const existingArtworks = Array.isArray(processedArtist.artworks) ? processedArtist.artworks : [];
                const combinedArtworks = [...existingArtworks, ...productImages].slice(0, 8); // Limit to 8 total
                processedArtist.artworks = combinedArtworks;
                
                logger.info(`Added ${productImages.length} product images to artist artworks`);
              }
              
              setProfile(defaultProfile);
            } catch (error) {
              logger.warn("Could not load artist profile data (table may not exist yet):", error);
              // Create a default profile without additional data
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
