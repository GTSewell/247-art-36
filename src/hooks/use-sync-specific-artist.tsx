
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface SyncResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Hook for syncing a specific artist's images
 */
export const useSyncSpecificArtist = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  /**
   * Sync images for a specific artist by ID
   */
  const syncArtistById = async (artistId: number): Promise<boolean> => {
    try {
      setIsSyncing(true);
      logger.info(`Starting manual sync for artist ID: ${artistId}`);
      
      // First get the artist details to find their name
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('name')
        .eq('id', artistId)
        .single();
      
      if (artistError) {
        throw new Error(`Failed to find artist with ID ${artistId}: ${artistError.message}`);
      }
      
      if (!artist || !artist.name) {
        throw new Error(`No artist found with ID ${artistId}`);
      }
      
      logger.info(`Found artist "${artist.name}" (ID: ${artistId}), proceeding with sync`);
      
      // Verify if storage folders exist with the sanitized artist name
      const sanitizedArtistName = artist.name.replace(/\s+/g, '_');
      
      // Try to check if the folder exists in storage (listing will throw an error if it doesn't exist)
      try {
        const { data: folders, error: folderError } = await supabase.storage
          .from('artists')
          .list(sanitizedArtistName);
          
        if (folderError) {
          logger.warn(`Warning: Could not find folder '${sanitizedArtistName}' for artist "${artist.name}": ${folderError.message}`);
        } else {
          logger.info(`Found artist folder with ${folders.length} subfolders: ${folders.map(f => f.name).join(', ')}`);
        }
      } catch (folderError) {
        logger.warn(`Warning: Error checking artist folder: ${folderError}`);
      }
      
      // Call the sync-artist-images edge function with specific artist ID
      const { data, error } = await supabase.functions.invoke('sync-artist-images', {
        body: { artistId }
      });
      
      if (error) {
        throw error;
      }
      
      // Now also call the download-artist-images function for good measure
      const { data: dlData, error: dlError } = await supabase.functions.invoke('download-artist-images', {
        body: { 
          artist_ids: [artistId],
          updateBothImageColumns: true
        }
      });
      
      if (dlError) {
        logger.warn(`Warning: download-artist-images had an error: ${dlError.message}`);
      }
      
      const combinedResult = {
        success: true,
        message: `Successfully synced artist ${artist.name} (ID: ${artistId})`,
        details: { syncResult: data, downloadResult: dlData }
      };
      
      setResult(combinedResult);
      toast.success(combinedResult.message);
      logger.info("Sync completed successfully:", combinedResult);
      
      // Refresh the artist in the artists context if it exists
      try {
        const { error: refreshError } = await supabase
          .from('artists')
          .select('*')
          .eq('id', artistId)
          .single();
          
        if (!refreshError) {
          logger.info("Artist record refreshed successfully");
        }
      } catch (refreshError) {
        logger.warn("Failed to refresh artist after sync:", refreshError);
      }
      
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error during sync';
      const errorResult = {
        success: false,
        message: `Sync failed: ${errorMessage}`
      };
      
      setResult(errorResult);
      toast.error(errorResult.message);
      logger.error("Error syncing artist:", error);
      
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    syncArtistById,
    isSyncing,
    result
  };
};
