
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/utils/uuid";
import { logger } from "@/utils/logger";
import { Json } from "@/integrations/supabase/types";

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
    } else {
      setLoading(false);
    }
  }, [artistId]);
  
  const fetchArtistArtworks = async () => {
    try {
      setLoading(true);
      logger.info(`Fetching artworks for artist ID: ${artistId}`);
      
      const { data, error } = await supabase
        .from('artists')
        .select('artworks, artwork_files')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (error) {
        logger.error("Error fetching artworks:", error);
        toast.error(`Failed to load artworks: ${error.message}`);
        setLoading(false);
        return;
      }
      
      // Process artworks from both sources
      let combinedArtworks: string[] = [];
      
      if (data) {
        // Process artworks array (legacy URL artworks if they exist)
        if (data.artworks) {
          let artworkArray: string[] = [];
          
          if (Array.isArray(data.artworks)) {
            // Convert each item to string to ensure type safety
            artworkArray = (data.artworks as Json[]).map(item => 
              typeof item === 'string' ? item : String(item)
            );
          } else if (typeof data.artworks === 'string') {
            try {
              const parsed = JSON.parse(data.artworks);
              if (Array.isArray(parsed)) {
                artworkArray = parsed.map(item => 
                  typeof item === 'string' ? item : String(item)
                );
              }
            } catch (e) {
              logger.error("Error parsing artworks JSON:", e);
              artworkArray = [];
            }
          }
          
          // Filter out invalid artwork URLs
          artworkArray = artworkArray.filter(url => 
            url && 
            (url.startsWith('http') || url.startsWith('/'))
          );
          
          combinedArtworks = [...combinedArtworks, ...artworkArray];
          logger.info(`Loaded ${artworkArray.length} artworks from artworks field`);
        }
        
        // Process artwork_files
        if (data.artwork_files) {
          let fileArray: string[] = [];
          
          if (Array.isArray(data.artwork_files)) {
            // Convert each item to string to ensure type safety
            fileArray = (data.artwork_files as Json[]).map(item => 
              typeof item === 'string' ? item : String(item)
            );
          } else if (typeof data.artwork_files === 'string') {
            try {
              const parsed = JSON.parse(data.artwork_files);
              if (Array.isArray(parsed)) {
                fileArray = parsed.map(item => 
                  typeof item === 'string' ? item : String(item)
                );
              }
            } catch (e) {
              logger.error("Error parsing artwork_files JSON:", e);
              fileArray = [];
            }
          }
          
          setArtworkFiles(fileArray);
          logger.info(`Loaded ${fileArray.length} artwork file paths`);
          
          // Get public URLs for each artwork file
          for (const filePath of fileArray) {
            if (filePath && filePath.trim() !== '') {
              const { data: { publicUrl } } = supabase
                .storage
                .from('artist-images')
                .getPublicUrl(filePath);
              
              if (publicUrl) {
                combinedArtworks.push(publicUrl);
              }
            }
          }
        }
        
        logger.info(`Total combined artworks: ${combinedArtworks.length}`);
        setArtworks(combinedArtworks);
      } else {
        logger.info("No artworks found for artist");
        setArtworks([]);
        setArtworkFiles([]);
      }
    } catch (error: any) {
      logger.error("Error in fetchArtistArtworks:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (file: File) => {
    if (!artistId) {
      toast.error("User ID not found");
      return false;
    }
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${artistId}/${fileName}`;
      
      logger.info(`Uploading file to ${filePath}`);
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('artist-images')
        .upload(filePath, file);
      
      if (uploadError) {
        logger.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('artist-images')
        .getPublicUrl(filePath);
      
      logger.info(`File uploaded successfully, public URL: ${publicUrl}`);
      
      // Update the artworks list in state
      const updatedArtworks = [...artworks, publicUrl];
      setArtworks(updatedArtworks);
      
      // Update the artwork files list in state and database
      const updatedArtworkFiles = [...artworkFiles, filePath];
      setArtworkFiles(updatedArtworkFiles);
      
      // Update the database
      const { error: dbError } = await supabase
        .from('artists')
        .update({ 
          artwork_files: updatedArtworkFiles,
          artworks: updatedArtworks // Also update the artworks array
        })
        .eq('user_id', artistId);
      
      if (dbError) {
        logger.error("Database update error:", dbError);
        throw dbError;
      }
      
      toast.success("Artwork uploaded successfully");
      return true;
    } catch (error: any) {
      logger.error("Error uploading artwork:", error);
      toast.error(`Failed to upload artwork: ${error.message}`);
      return false;
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveArtwork = async (index: number) => {
    if (!artistId) {
      toast.error("User ID not found");
      return false;
    }
    
    try {
      setLoading(true);
      
      // Get the artwork URL and file path to remove
      const artworkToRemove = artworks[index];
      
      // Remove from artworks list
      const updatedArtworks = [...artworks];
      updatedArtworks.splice(index, 1);
      setArtworks(updatedArtworks);
      
      // If we have a file path for this artwork, remove it from storage
      let updatedArtworkFiles = [...artworkFiles];
      let filePathToRemove: string | null = null;
      
      // Check if the file is in artwork_files array
      if (index < artworkFiles.length) {
        filePathToRemove = artworkFiles[index];
        
        // Remove file from storage
        if (filePathToRemove) {
          logger.info(`Removing file from storage: ${filePathToRemove}`);
          const { error: storageError } = await supabase
            .storage
            .from('artist-images')
            .remove([filePathToRemove]);
          
          if (storageError) {
            logger.error("Error removing file from storage:", storageError);
          }
        }
        
        // Remove from artwork_files list
        updatedArtworkFiles.splice(index, 1);
        setArtworkFiles(updatedArtworkFiles);
      }
      
      // Update the database
      const { error: dbError } = await supabase
        .from('artists')
        .update({ 
          artwork_files: updatedArtworkFiles,
          artworks: updatedArtworks
        })
        .eq('user_id', artistId);
      
      if (dbError) throw dbError;
      
      toast.success("Artwork removed successfully");
      return true;
    } catch (error: any) {
      logger.error("Error removing artwork:", error);
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
