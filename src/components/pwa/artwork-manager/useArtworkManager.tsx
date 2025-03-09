
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useArtworkManager = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<string[]>([]);
  
  useEffect(() => {
    if (artistId) {
      fetchArtistArtworks();
    }
  }, [artistId]);
  
  const fetchArtistArtworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('artworks')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        console.log("No existing artworks found");
      }
      
      if (data && data.artworks) {
        // Parse artworks if needed
        const artworkArray = Array.isArray(data.artworks) 
          ? data.artworks 
          : typeof data.artworks === 'string' 
            ? JSON.parse(data.artworks) 
            : [];
            
        setArtworks(artworkArray);
      }
    } catch (error: any) {
      console.error("Error fetching artworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const addArtworkByUrl = async (newArtworkUrl: string) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedArtworks = [...artworks, newArtworkUrl];
      
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', artistId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
      toast.success("Artwork added successfully");
    } catch (error: any) {
      console.error("Error adding artwork:", error);
      toast.error(`Failed to add artwork: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const removeArtwork = async (index: number) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      
      const { error } = await supabase
        .from('artists')
        .update({ artworks: updatedArtworks })
        .eq('user_id', artistId);
      
      if (error) throw error;
      
      setArtworks(updatedArtworks);
      toast.success("Artwork removed successfully");
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    artworks,
    addArtworkByUrl,
    removeArtwork
  };
};
