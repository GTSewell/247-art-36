
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/utils/uuid";
import { logger } from "@/utils/logger";
import { Json } from "@/integrations/supabase/types";
import { uploadImage } from "@/components/pwa/artist-settings/api/imageUploadAPI";

export interface ArtworkData {
  publicUrl: string;
  filePath?: string;
}

export const useArtistArtworks = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [artworks, setArtworks] = useState<string[]>([]);
  const [artworkFiles, setArtworkFiles] = useState<string[]>([]);
  const [artistName, setArtistName] = useState<string>("");
  
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
      logger.info(`Fetching artist data for ID: ${artistId}`);
      
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('name, artworks, artwork_files')
        .eq('user_id', artistId)
        .maybeSingle();
      
      if (artistError) {
        logger.error("Error fetching artist data:", artistError);
        toast.error(`Failed to load artist data: ${artistError.message}`);
        setLoading(false);
        return;
      }
      
      if (artistData) {
        setArtistName(artistData.name || "Unknown Artist");
        
        // Process artworks array (legacy URL artworks if they exist)
        let combinedArtworks: string[] = [];
        
        if (artistData.artworks) {
          let artworkArray: string[] = [];
          
          if (Array.isArray(artistData.artworks)) {
            // Convert each item to string to ensure type safety
            artworkArray = (artistData.artworks as Json[]).map(item => 
              typeof item === 'string' ? item : String(item)
            );
          } else if (typeof artistData.artworks === 'string') {
            try {
              const parsed = JSON.parse(artistData.artworks);
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
        if (artistData.artwork_files) {
          let fileArray: string[] = [];
          
          if (Array.isArray(artistData.artwork_files)) {
            // Convert each item to string to ensure type safety
            fileArray = (artistData.artwork_files as Json[]).map(item => 
              typeof item === 'string' ? item : String(item)
            );
          } else if (typeof artistData.artwork_files === 'string') {
            try {
              const parsed = JSON.parse(artistData.artwork_files);
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
          // Check both buckets
          const buckets = ['artists', 'artist-images'];
          
          for (const filePath of fileArray) {
            if (filePath && filePath.trim() !== '') {
              // Try both buckets
              for (const bucket of buckets) {
                try {
                  const { data: { publicUrl } } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(filePath);
                  
                  if (publicUrl) {
                    combinedArtworks.push(publicUrl);
                    break; // Found in this bucket, no need to check others
                  }
                } catch (error) {
                  // Skip errors, try the next bucket
                  continue;
                }
              }
            }
          }
        }
        
        logger.info(`Total combined artworks: ${combinedArtworks.length}`);
        setArtworks(combinedArtworks);
      } else {
        logger.info("No artist data found for user");
        setArtworks([]);
        setArtworkFiles([]);
      }
    } catch (error: any) {
      logger.error("Error in fetchArtistData:", error);
      toast.error(`Failed to load artworks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadArtwork = async (file: File, artistName: string) => {
    if (!artistId) {
      toast.error("User ID not found");
      return false;
    }
    
    try {
      setUploading(true);
      
      // Use the uploadImage function with isProfileImage=false to indicate it's an artwork
      const publicUrl = await uploadImage(file, artistName, false);
      
      if (!publicUrl) {
        throw new Error("Failed to upload artwork");
      }
      
      logger.info(`File uploaded successfully, public URL: ${publicUrl}`);
      
      // Extract the file path from the URL
      const urlObj = new URL(publicUrl);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'object' || part === 'storage');
      const filePath = pathParts.slice(bucketIndex + 2).join('/');
      
      logger.info(`Extracted file path: ${filePath}`);
      
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
          
          // Try both buckets
          const buckets = ['artists', 'artist-images'];
          for (const bucket of buckets) {
            try {
              const { error: storageError } = await supabase
                .storage
                .from(bucket)
                .remove([filePathToRemove]);
              
              if (!storageError) {
                logger.info(`Successfully removed file from ${bucket} bucket`);
                break; // Successfully deleted, no need to try other buckets
              }
            } catch (error) {
              // Skip errors, try the next bucket
              continue;
            }
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
    artistName,
    handleUploadArtwork,
    handleRemoveArtwork,
    fetchArtistData
  };
};
