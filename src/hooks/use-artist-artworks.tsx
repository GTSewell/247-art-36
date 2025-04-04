import { useState, useEffect } from 'react';
import { uploadArtwork, fetchArtistData, removeArtwork, reorderArtworks, setArtworkAsBackground, syncArtistImages } from '@/hooks/artwork/api/artwork-api';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artistName, setArtistName] = useState('');
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    if (artistId) {
      loadArtistData();
    } else {
      setLoading(false);
    }
  }, [artistId]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      logger.info(`Loading artist data for ID: ${effectiveArtistId}`);
      const { data, error } = await fetchArtistData(effectiveArtistId as string);
      
      if (error) throw error;
      
      if (data) {
        setArtist(data);
        setArtistName(data.name || 'Unknown Artist');
        
        // Process artworks array
        let artworksArray: string[] = [];
        
        if (data.artworks) {
          if (typeof data.artworks === 'string') {
            try {
              artworksArray = JSON.parse(data.artworks);
            } catch (e) {
              logger.error('Error parsing artworks JSON:', e);
              artworksArray = [];
            }
          } else if (Array.isArray(data.artworks)) {
            artworksArray = data.artworks;
          }
        }
        
        setArtworks(artworksArray);
        logger.info(`Loaded ${artworksArray.length} artworks for artist: ${data.name}`);
      }
    } catch (error: any) {
      logger.error('Error loading artist data:', error);
      toast.error(`Failed to load artist data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadArtwork = async (file: File, name: string): Promise<boolean> => {
    try {
      setUploading(true);
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      const { url, updatedArtworks, error } = await uploadArtwork(file, name, effectiveArtistId);
      
      if (error) throw error;
      
      if (url) {
        // Update the artworks array if we got updated artworks back
        if (updatedArtworks) {
          setArtworks(updatedArtworks);
        } else {
          // Otherwise just add the new URL to the existing array
          setArtworks(prev => [...prev, url]);
        }
        
        toast.success('Artwork uploaded successfully');
        return true;
      }
      
      return false;
    } catch (error: any) {
      logger.error('Error uploading artwork:', error);
      toast.error(`Failed to upload artwork: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveArtwork = async (index: number) => {
    try {
      if (!artistId) return;
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      const { success, updatedArtworks, error } = await removeArtwork(effectiveArtistId, artworks, index);
      
      if (error) throw error;
      
      if (success && updatedArtworks) {
        setArtworks(updatedArtworks);
        toast.success('Artwork removed successfully');
      }
    } catch (error: any) {
      logger.error('Error removing artwork:', error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };

  const handleReorderArtworks = async (newOrder: string[]) => {
    try {
      if (!artistId) return;
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      const { success, error } = await reorderArtworks(effectiveArtistId, newOrder);
      
      if (error) throw error;
      
      if (success) {
        setArtworks(newOrder);
        toast.success('Artworks reordered successfully');
      }
    } catch (error: any) {
      logger.error('Error reordering artworks:', error);
      toast.error(`Failed to reorder artworks: ${error.message}`);
    }
  };

  const handleSetAsBackgroundImage = async (artworkUrl: string) => {
    try {
      if (!artistId) return;
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      const { success, error } = await setArtworkAsBackground(effectiveArtistId, artworkUrl);
      
      if (error) throw error;
      
      if (success) {
        // Update local artist state
        setArtist(prev => ({
          ...prev,
          image: artworkUrl
        }));
        
        toast.success('Background image updated successfully');
      }
    } catch (error: any) {
      logger.error('Error setting background image:', error);
      toast.error(`Failed to set background image: ${error.message}`);
    }
  };

  const syncArtistImagesHandler = async () => {
    try {
      if (!artistId) return;
      
      // If it's the demo artist, always use ID 25
      const effectiveArtistId = artistId === "demo" ? "25" : artistId;
      
      const { success, error } = await syncArtistImages(effectiveArtistId);
      
      if (error) throw error;
      
      if (success) {
        toast.success('Artist images synced successfully');
      }
    } catch (error: any) {
      logger.error('Error syncing artist images:', error);
      toast.error(`Failed to sync artist images: ${error.message}`);
    }
  };

  return {
    loading,
    uploading,
    artworks,
    artistName,
    artist,
    handleUploadArtwork,
    handleRemoveArtwork,
    handleReorderArtworks,
    handleSetAsBackgroundImage,
    syncArtistImages: syncArtistImagesHandler
  };
};
