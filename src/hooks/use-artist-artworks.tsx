
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  fetchArtistData as fetchArtistDataApi, 
  uploadArtwork, 
  removeArtwork, 
  setArtworkAsBackground,
  syncArtistImages as syncImages
} from "./artwork/api/artwork-api";
import { processArtworks } from "./artwork/utils/artwork-utils";

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
      
      const { data, error } = await fetchArtistDataApi(artistId);
      
      if (error) throw error;
      
      if (data) {
        setArtist(data);
        setArtistName(data.name || "Unnamed_Artist");
        setArtworks(processArtworks(data.artworks));
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
      
      const { url, updatedArtworks, error } = await uploadArtwork(file, name, artistId);
      
      if (error) throw error;
      
      if (!artistId) {
        // If no artist ID yet, just add it to local state
        if (url) {
          setArtworks(prev => [...prev, url]);
          toast.success("Artwork uploaded successfully");
        }
      } else if (updatedArtworks) {
        // Update local state with the new artworks array
        setArtworks(updatedArtworks.map(artwork => artwork.toString()));
        toast.success("Artwork uploaded successfully");
      }
      
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
      
      const { success, error } = await syncImages(artistId);
      
      if (error) throw error;
      
      if (success) {
        toast.success("Artist images synchronized successfully");
        fetchArtistData(); // Refresh artwork data
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error syncing images:", error);
      toast.error(`Failed to sync images: ${error.message}`);
      return false;
    }
  };
  
  const handleRemoveArtwork = async (index: number): Promise<void> => {
    try {
      if (!artistId) return;
      
      const { success, updatedArtworks, error } = await removeArtwork(artistId, artworks, index);
      
      if (error) throw error;
      
      if (success && updatedArtworks) {
        setArtworks(updatedArtworks);
        toast.success("Artwork removed successfully");
      }
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    }
  };
  
  const handleSetAsBackgroundImage = async (artworkUrl: string): Promise<void> => {
    try {
      if (!artistId) return;
      
      const { success, error } = await setArtworkAsBackground(artistId, artworkUrl);
      
      if (error) throw error;
      
      if (success) {
        // Update local state
        setArtist(prev => ({ ...prev, image: artworkUrl }));
        toast.success("Background image updated successfully");
        
        // Refresh data to ensure UI is updated correctly
        fetchArtistData();
      }
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
