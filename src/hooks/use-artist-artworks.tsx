
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/utils/uuid";

export interface ArtworkData {
  publicUrl: string;
  filePath?: string;
}

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artworkFiles, setArtworkFiles] = useState<string[]>([]);
  
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
        .select('artworks, artwork_files')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        console.log("No existing artworks found");
      }
      
      if (data) {
        // Process artworks from both sources
        let combinedArtworks: string[] = [];
        
        // Process legacy URL artworks if they exist
        if (data.artworks) {
          const artworkArray = Array.isArray(data.artworks) 
            ? data.artworks 
            : typeof data.artworks === 'string' 
              ? JSON.parse(data.artworks) 
              : [];
          combinedArtworks = [...combinedArtworks, ...artworkArray];
        }
        
        // Process new file-based artworks
        if (data.artwork_files) {
          const fileArray = Array.isArray(data.artwork_files) 
            ? data.artwork_files 
            : typeof data.artwork_files === 'string' 
              ? JSON.parse(data.artwork_files) 
              : [];
          setArtworkFiles(fileArray);
          
          // Get public URLs for each artwork file
          for (const filePath of fileArray) {
            const { data: { publicUrl } } = supabase
              .storage
              .from('artist-images')
              .getPublicUrl(filePath);
            
            combinedArtworks.push(publicUrl);
          }
        }
        
        setArtworks(combinedArtworks);
      }
    } catch (error: any) {
      console.error("Error fetching artworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (file: File) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${artistId}/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('artist-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('artist-images')
        .getPublicUrl(filePath);
      
      // Update the artworks list in state
      const updatedArtworks = [...artworks, publicUrl];
      setArtworks(updatedArtworks);
      
      // Update the artwork files list in state and database
      const updatedArtworkFiles = [...artworkFiles, filePath];
      setArtworkFiles(updatedArtworkFiles);
      
      // Update the database
      const { error: dbError } = await supabase
        .from('artists')
        .update({ artwork_files: updatedArtworkFiles })
        .eq('user_id', artistId);
      
      if (dbError) throw dbError;
      
      toast.success("Artwork uploaded successfully");
      return true;
    } catch (error: any) {
      console.error("Error uploading artwork:", error);
      toast.error(`Failed to upload artwork: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveArtwork = async (index: number) => {
    if (!artistId) {
      toast.error("User ID not found");
      return;
    }
    
    try {
      setLoading(true);
      
      // Remove from artworks list
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      setArtworks(updatedArtworks);
      
      // If we have a file path for this artwork, remove it from storage
      if (index < artworkFiles.length) {
        const filePath = artworkFiles[index];
        
        // Remove file from storage
        const { error: storageError } = await supabase
          .storage
          .from('artist-images')
          .remove([filePath]);
        
        if (storageError) {
          console.error("Error removing file from storage:", storageError);
        }
        
        // Remove from artwork_files list
        const updatedArtworkFiles = [...artworkFiles];
        updatedArtworkFiles.splice(index, 1);
        setArtworkFiles(updatedArtworkFiles);
        
        // Update the database
        const { error: dbError } = await supabase
          .from('artists')
          .update({ artwork_files: updatedArtworkFiles })
          .eq('user_id', artistId);
        
        if (dbError) throw dbError;
      }
      
      toast.success("Artwork removed successfully");
      return true;
    } catch (error: any) {
      console.error("Error removing artwork:", error);
      toast.error(`Failed to remove artwork: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    uploading,
    artworks,
    handleUploadArtwork,
    handleRemoveArtwork,
    fetchArtistArtworks
  };
};
