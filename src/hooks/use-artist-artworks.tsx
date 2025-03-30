
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import { ensureArray } from "@/utils/ensureArray";

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artistName, setArtistName] = useState("");
  const [artist, setArtist] = useState<any>(null);

  useEffect(() => {
    if (artistId) {
      fetchArtistData();
    } else {
      setLoading(false);
    }
  }, [artistId]);

  const fetchArtistData = async () => {
    try {
      if (!artistId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid artist ID");
      }

      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", numericId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setArtist(data);
        setArtistName(data.name || "");

        // Handle different types of artwork data using the ensureArray utility
        if (data.artworks) {
          // Convert any type of input to a string array
          const artworkArray = ensureArray(data.artworks);
          setArtworks(artworkArray);
        } else {
          setArtworks([]);
        }
      }
    } catch (error: any) {
      logger.error("Error fetching artist data:", error);
      toast.error(`Failed to load artist data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadArtwork = async (file: File, artistName: string): Promise<boolean> => {
    if (!artistId) {
      toast.error("No artist ID provided for upload.");
      return false;
    }
    
    if (!file || !artistName) {
      toast.error("Missing file or artist name for upload.");
      return false;
    }

    try {
      setUploading(true);
      
      // Sanitize artist name for folder structure
      const folderName = artistName.replace(/\s+/g, "_").replace(/[^\w-]/g, "");
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${folderName}/Artworks/${fileName}`;
      
      logger.info(`Uploading artwork to path: artists/${filePath}`);
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('artists')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('artists')
        .getPublicUrl(filePath);
      
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }

      const publicUrl = publicUrlData.publicUrl;
      logger.info("Artwork uploaded successfully:", publicUrl);
      
      // Update artist's artworks array
      const numericId = parseInt(artistId, 10);
      
      // First get current artworks
      const { data: currentArtist, error: fetchError } = await supabase
        .from("artists")
        .select("artworks")
        .eq("id", numericId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Prepare the updated artworks array using ensureArray utility
      const currentArtworks = ensureArray(currentArtist.artworks);
      const updatedArtworks = [...currentArtworks, publicUrl];
      
      // Update the database
      const { error: updateError } = await supabase
        .from("artists")
        .update({ artworks: updatedArtworks })
        .eq("id", numericId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update state
      setArtworks(updatedArtworks);
      toast.success("Artwork uploaded successfully");
      return true;
    } catch (error: any) {
      logger.error("Error uploading artwork:", error);
      toast.error(`Upload failed: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Updated to accept index parameter
  const handleRemoveArtwork = async (index: number): Promise<void> => {
    if (!artistId || index < 0 || index >= artworks.length) return;
    
    const artworkUrl = artworks[index];

    try {
      // Extract the path from the URL
      const urlObj = new URL(artworkUrl);
      const pathMatch = urlObj.pathname.match(/\/object\/public\/artists\/(.+)$/);
      
      if (!pathMatch) {
        throw new Error("Invalid artwork URL format");
      }
      
      const storagePath = pathMatch[1];
      logger.info(`Removing artwork from storage path: ${storagePath}`);
      
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('artists')
        .remove([storagePath]);
      
      if (storageError) {
        throw storageError;
      }
      
      // Update artist's artworks array
      const numericId = parseInt(artistId, 10);
      const updatedArtworks = artworks.filter((_, i) => i !== index);
      
      const { error: updateError } = await supabase
        .from("artists")
        .update({ artworks: updatedArtworks })
        .eq("id", numericId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update state
      setArtworks(updatedArtworks);
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      logger.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };

  // Fixed version that accepts a URL string
  const handleSetAsBackgroundImage = async (artworkUrl: string): Promise<void> => {
    if (!artistId || !artworkUrl) return;

    try {
      const numericId = parseInt(artistId, 10);
      
      const { error } = await supabase
        .from("artists")
        .update({ image: artworkUrl })
        .eq("id", numericId);
      
      if (error) {
        throw error;
      }
      
      // Update local state if needed
      setArtist(prev => ({ ...prev, image: artworkUrl }));
      toast.success("Artwork set as profile image");
    } catch (error: any) {
      logger.error("Error setting background image:", error);
      toast.error(`Failed to set as profile image: ${error.message}`);
    }
  };

  // Updated to return boolean
  const syncArtistImages = async (): Promise<boolean> => {
    try {
      if (!artistId) return false;
      
      const numericId = parseInt(artistId, 10);
      
      // Call edge function to sync images
      const { data, error } = await supabase.functions.invoke("sync-artist-images", {
        body: { artist_id: numericId }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        // Reload artist data to show updated images
        await fetchArtistData();
        toast.success("Artist images synchronized successfully");
        return true;
      } else {
        toast.info(data?.message || "No changes to synchronize");
        return true; // Still return true as the operation completed successfully
      }
    } catch (error: any) {
      logger.error("Error syncing artist images:", error);
      toast.error(`Failed to sync images: ${error.message}`);
      return false;
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
    handleSetAsBackgroundImage,
    syncArtistImages
  };
};
