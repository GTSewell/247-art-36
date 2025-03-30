
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "@/components/pwa/artist-settings/api/imageUploadAPI";
import { ensureArray } from "@/utils/ensureArray";

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artist, setArtist] = useState<any>(null);
  const [artistName, setArtistName] = useState("Unnamed_Artist");
  
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
        setLoading(false);
        return;
      }
      
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid artist ID");
      }
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', numericId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setArtist(data);
        setArtistName(data.name || "Unnamed_Artist");
        
        // Convert artworks from JSON to array of strings
        const artworkArray = ensureArray(data.artworks);
        // Fix: map array to ensure each element is a string
        setArtworks(artworkArray.map(artwork => artwork.toString()));
      }
    } catch (error: any) {
      console.error("Error fetching artist data:", error);
      toast.error(`Error loading artist: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (file: File, name: string): Promise<boolean> => {
    try {
      setUploading(true);
      
      // Upload image to storage
      const safeName = name.replace(/\s+/g, '_');
      // Fix: Remove the fourth argument which is causing the type error
      const imageUrl = await uploadImage(file, safeName, false);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      
      // If there's no artist ID yet, just add it to the local state
      if (!artistId) {
        setArtworks(prev => [...prev, imageUrl]);
        toast.success("Artwork uploaded successfully");
        return true;
      }
      
      // Update the artist record with the new artwork
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid artist ID");
      }
      
      // Get current artworks
      const { data: artistData, error: fetchError } = await supabase
        .from('artists')
        .select('artworks')
        .eq('id', numericId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Convert to array and add new artwork
      const currentArtworks = ensureArray(artistData.artworks || []);
      const updatedArtworks = [...currentArtworks, imageUrl];
      
      // Update the database
      const { error: updateError } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', numericId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setArtworks(updatedArtworks.map(artwork => artwork.toString()));
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
  
  const syncArtistImages = async (): Promise<boolean> => {
    try {
      if (!artistId) return false;
      
      // Call the sync-artist-images function
      const { data, error } = await supabase.functions.invoke('sync-artist-images', {
        body: { artistId }
      });
      
      if (error) throw error;
      
      console.log("Image sync response:", data);
      toast.success("Artist images synchronized successfully");
      
      // Refresh artwork data
      fetchArtistData();
      return true;
    } catch (error: any) {
      console.error("Error syncing images:", error);
      toast.error(`Failed to sync images: ${error.message}`);
      return false;
    }
  };
  
  const handleRemoveArtwork = async (index: number): Promise<void> => {
    try {
      if (!artistId) return;
      
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid artist ID");
      }
      
      // Create a copy of the artworks array and remove the selected artwork
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      
      // Update the database
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('id', numericId);
      
      if (error) throw error;
      
      // Update local state
      setArtworks(updatedArtworks);
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };
  
  const handleSetAsBackgroundImage = async (artworkUrl: string): Promise<void> => {
    try {
      if (!artistId) return;
      
      const numericId = parseInt(artistId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("Invalid artist ID");
      }
      
      // Update the artist's image field with the selected artwork URL
      const { error } = await supabase
        .from('artists')
        .update({ image: artworkUrl })
        .eq('id', numericId);
      
      if (error) throw error;
      
      // Update local state
      setArtist(prev => ({ ...prev, image: artworkUrl }));
      toast.success("Background image updated successfully");
    } catch (error: any) {
      console.error("Error setting background image:", error);
      toast.error(`Failed to set background image: ${error.message}`);
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
