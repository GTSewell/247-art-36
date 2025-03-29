
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  getFilesFromFolder, 
  uploadImage, 
  updateArtistBackgroundImage, 
  deleteFileFromStorage 
} from "@/components/pwa/artist-settings/api/imageUploadAPI";
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";
import { transformArtist } from "@/utils/artist-transformer";

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artistName, setArtistName] = useState("");
  const [artist, setArtist] = useState<Artist | null>(null);

  const fetchArtist = useCallback(async () => {
    if (!artistId) return;
    
    try {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", parseInt(artistId, 10)) // Convert string ID to number
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform raw DB data to Artist type
        const transformedArtist = transformArtist(data);
        setArtist(transformedArtist);
        setArtistName(transformedArtist.name || "Unknown Artist");
      }
    } catch (error) {
      logger.error("Error fetching artist:", error);
      toast.error("Failed to load artist information");
    }
  }, [artistId]);

  const fetchArtworks = useCallback(async () => {
    if (!artistId || !artistName) return;
    
    try {
      setLoading(true);
      
      // Sanitize artist name for folder path
      const sanitizedArtistName = artistName.replace(/\s+/g, '_');
      // Use the standard path structure
      const folderPath = `${sanitizedArtistName}/Artworks`;
      
      logger.info(`Fetching artworks from: ${folderPath}`);
      const artworkUrls = await getFilesFromFolder('artists', folderPath);
      logger.info(`Retrieved ${artworkUrls.length} artworks`);
      setArtworks(artworkUrls);
    } catch (error) {
      logger.error("Error fetching artworks:", error);
      toast.error("Failed to load artworks");
    } finally {
      setLoading(false);
    }
  }, [artistId, artistName]);

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);
  
  useEffect(() => {
    if (artistName) {
      fetchArtworks();
    }
  }, [fetchArtworks, artistName]);

  const syncArtistImages = async () => {
    if (!artist || !artist.id) {
      return false;
    }
    
    try {
      logger.info(`Syncing images for artist ID ${artist.id}`);
      
      // Call the sync-artist-images edge function
      const { data, error } = await supabase.functions.invoke('sync-artist-images', {
        body: { artistId: artist.id }
      });
      
      if (error) {
        logger.error("Error syncing artist images:", error);
        return false;
      }
      
      logger.info("Artist images sync response:", data);
      // Refresh artworks after sync
      await fetchArtworks();
      return true;
    } catch (error) {
      logger.error("Failed to sync artist images:", error);
      return false;
    }
  };

  const handleUploadArtwork = async (file: File, artistName: string): Promise<boolean> => {
    if (!file || !artistName) {
      toast.error("Missing file or artist information");
      return false;
    }
    
    try {
      setUploading(true);
      
      // Upload to storage - use uploadImage with isProfileImage=false for artwork
      const imageUrl = await uploadImage(file, artistName, false);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      
      // Refresh artworks list
      await fetchArtworks();
      
      toast.success("Artwork uploaded successfully");
      return true;
    } catch (error) {
      logger.error("Error uploading artwork:", error);
      toast.error("Failed to upload artwork");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveArtwork = async (index: number) => {
    if (index < 0 || index >= artworks.length) {
      toast.error("Invalid artwork selection");
      return;
    }
    
    try {
      const artworkUrl = artworks[index];
      
      // Delete the file from storage first
      const deleteSuccess = await deleteFileFromStorage(artworkUrl);
      
      if (!deleteSuccess) {
        throw new Error("Failed to delete artwork from storage");
      }
      
      // Check if artist has artwork_files property and if this artwork is being used as background image
      if (artist && artist.artwork_files && 
          typeof artist.artwork_files === 'object' && 
          'background_image' in artist.artwork_files && 
          artist.artwork_files.background_image === artworkUrl) {
        
        // Clear the background image reference
        const artworkFilesObj = artist.artwork_files as Record<string, any>;
        const { error: updateError } = await supabase
          .from('artists')
          .update({ 
            artwork_files: {
              ...artworkFilesObj,
              background_image: null
            }
          })
          .eq('id', artist.id);
          
        if (updateError) {
          logger.error("Error updating artist record after artwork deletion:", updateError);
        }
      }
      
      // Update state
      setArtworks(prev => prev.filter((_, i) => i !== index));
      
      // After successful deletion, sync the artist images
      const syncSuccess = await syncArtistImages();
      
      if (syncSuccess) {
        logger.info("Successfully synced artist images after deletion");
      } else {
        logger.warn("Failed to sync artist images after deletion");
      }
      
      toast.success("Artwork removed successfully");
    } catch (error) {
      logger.error("Error removing artwork:", error);
      toast.error("Failed to remove artwork");
    }
  };
  
  const handleSetAsBackgroundImage = async (artworkUrl: string) => {
    if (!artist || !artist.id) {
      toast.error("Artist information not available");
      return;
    }
    
    try {
      const success = await updateArtistBackgroundImage(artist.id, artworkUrl);
      
      if (success) {
        toast.success("Background image updated successfully");
      } else {
        throw new Error("Failed to update background image");
      }
    } catch (error) {
      logger.error("Error setting background image:", error);
      toast.error("Failed to set artwork as background image");
    }
  };

  return {
    loading,
    uploading,
    artworks,
    artist,
    artistName,
    handleUploadArtwork,
    handleRemoveArtwork,
    handleSetAsBackgroundImage,
    syncArtistImages
  };
};
