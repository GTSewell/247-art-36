
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "@/components/pwa/artist-settings/api/imageUploadAPI";
import { logger } from "@/utils/logger";
import { Json } from "@/integrations/supabase/types";

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artistName, setArtistName] = useState("");
  
  useEffect(() => {
    if (artistId) {
      fetchArtistData();
    } else {
      setLoading(false);
    }
  }, [artistId]);
  
  const fetchArtistData = async () => {
    try {
      setLoading(true);
      
      if (!artistId) {
        throw new Error("Artist ID not found");
      }
      
      // Convert string id to number for database query
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      const { data, error } = await supabase
        .from('artists')
        .select('name, artworks')
        .eq('id', numericId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        logger.info("Artist data for artworks:", data);
        setArtistName(data.name || "");
        
        // Parse artworks array
        let artworksArray: string[] = [];
        
        if (data.artworks) {
          // Handle different formats of the artworks field
          if (typeof data.artworks === 'string') {
            try {
              artworksArray = JSON.parse(data.artworks);
            } catch (e) {
              logger.error("Error parsing artworks JSON string:", e);
            }
          } else if (Array.isArray(data.artworks)) {
            // Ensure all items in the array are strings
            artworksArray = (data.artworks as Json[]).map(item => 
              typeof item === 'string' ? item : String(item)
            );
          } else if (typeof data.artworks === 'object') {
            artworksArray = Object.values(data.artworks)
              .filter(value => value !== null && value !== undefined)
              .map(value => typeof value === 'string' ? value : String(value));
          }
        }
        
        logger.info("Processed artworks array:", artworksArray);
        setArtworks(artworksArray.filter(url => url && url.trim() !== ''));
      }
    } catch (error: any) {
      console.error("Error fetching artist artworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (file: File, artistName: string): Promise<boolean> => {
    try {
      setUploading(true);
      
      if (!artistId) {
        toast.error("Artist ID not found");
        return false;
      }
      
      // Use artist name for folder organization, fallback to "Unnamed Artist" if not provided
      const safeArtistName = artistName?.trim() || "Unnamed_Artist";
      
      logger.info(`Uploading artwork for artist: ${safeArtistName}`);
      
      // Upload to storage with isProfileImage=false to put in Artworks subfolder
      const imageUrl = await uploadImage(file, safeArtistName, false);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      
      // Update artworks array
      const updatedArtworks = [...artworks, imageUrl];
      
      // Convert string id to number for database operations
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      // Update artist record with new artworks array
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', numericId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
      toast.success("Artwork uploaded successfully");
      return true;
    } catch (error: any) {
      console.error("Error uploading artwork:", error);
      toast.error(`Upload failed: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveArtwork = async (index: number) => {
    try {
      if (!artistId) {
        toast.error("Artist ID not found");
        return;
      }
      
      // Create a copy of the artworks array and remove the specified artwork
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      
      // Convert string id to number for database operations
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid artist ID format: ${artistId}`);
      }
      
      // Update artist record with new artworks array
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', numericId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };
  
  return {
    loading,
    uploading,
    artworks,
    artistName,
    handleUploadArtwork,
    handleRemoveArtwork
  };
};
