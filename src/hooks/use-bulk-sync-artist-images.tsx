
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface SyncResult {
  success: number;
  failed: number;
  skipped: number;
  results: {
    success: Array<{ id: number; name: string; newUrl: string }>;
    failed: Array<{ id: number; reason: string }>;
    skipped: Array<{ id: number; reason: string }>;
  };
}

export const useBulkSyncArtistImages = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  /**
   * Sync artist images for all or specific artists
   */
  const syncArtistImages = async (artistIds?: number[] | string[]): Promise<boolean> => {
    try {
      setIsSyncing(true);
      setErrorDetails(null);
      
      // Convert string IDs to numbers if provided
      const processedIds = artistIds?.map(id => 
        typeof id === 'string' ? parseInt(id, 10) : id
      ).filter(id => !isNaN(id));
      
      // Log what we're about to do
      logger.info(`Starting bulk sync of artist images${processedIds ? ' for IDs: ' + processedIds.join(', ') : ' for all artists'}`);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('download-artist-images', {
        body: { 
          regenerateAll: !processedIds || processedIds.length === 0,
          artist_ids: processedIds || [] 
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Store the result
        setResult(data as SyncResult);
        
        const successCount = data.success || 0;
        const failedCount = data.failed || 0;
        const skippedCount = data.skipped || 0;
        
        // Show user-friendly toast
        if (successCount > 0) {
          toast.success(`Successfully synced ${successCount} artists`);
        }
        
        if (failedCount > 0 || skippedCount > 0) {
          toast.warning(`${failedCount} failed, ${skippedCount} skipped`);
        }
        
        // Log detailed results
        logger.info('Sync results:', data);
        
        return successCount > 0;
      }
      
      return false;
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error during image sync';
      logger.error('Error syncing artist images:', error);
      setErrorDetails(errorMessage);
      toast.error(`Image sync failed: ${errorMessage}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  
  /**
   * Sync images for a specific artist ID range (e.g., ID 26 and above)
   */
  const syncArtistImagesFromId = async (startId: number): Promise<boolean> => {
    try {
      setIsSyncing(true);
      
      // First, get all artist IDs above the specified starting ID
      const { data: artists, error: fetchError } = await supabase
        .from('artists')
        .select('id')
        .gte('id', startId)
        .order('id', { ascending: true });
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!artists || artists.length === 0) {
        toast.warning(`No artists found with ID ${startId} or above`);
        return false;
      }
      
      // Extract just the IDs
      const artistIds = artists.map(artist => artist.id);
      logger.info(`Found ${artistIds.length} artists with ID ${startId} or above: ${artistIds.join(', ')}`);
      
      // Perform the sync
      return await syncArtistImages(artistIds);
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error during image sync';
      logger.error(`Error syncing artists from ID ${startId}:`, error);
      setErrorDetails(errorMessage);
      toast.error(`Image sync failed: ${errorMessage}`);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncArtistImages,
    syncArtistImagesFromId,
    isSyncing,
    result,
    errorDetails
  };
};
