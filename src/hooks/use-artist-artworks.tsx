
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getFilesFromFolder, uploadImage, updateArtistBackgroundImage } from "@/components/pwa/artist-settings/api/imageUploadAPI";
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";

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
        .eq("id", artistId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setArtist(data);
        setArtistName(data.name || "Unknown Artist");
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
      const folderPath = `${sanitizedArtistName}/Artworks`;
      
      const artworkUrls = await getFilesFromFolder('artists', folderPath);
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

  const handleUploadArtwork = async (file: File, artistName: string): Promise<boolean> => {
    if (!file || !artistName) {
      toast.error("Missing file or artist information");
      return false;
    }
    
    try {
      setUploading(true);
      
      // Upload to storage
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
      
      // Extract the path from the URL
      const urlParts = artworkUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const sanitizedArtistName = artistName.replace(/\s+/g, '_');
      const filePath = `${sanitizedArtistName}/Artworks/${fileName}`;
      
      // Remove from storage
      const { error } = await supabase.storage
        .from('artists')
        .remove([filePath]);
      
      if (error) {
        throw error;
      }
      
      // Update state
      setArtworks(prev => prev.filter((_, i) => i !== index));
      
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
    handleSetAsBackgroundImage
  };
};
