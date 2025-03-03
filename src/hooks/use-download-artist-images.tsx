
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface DownloadResult {
  success: Array<{
    id: number;
    name: string;
    newUrl: string;
  }>;
  failed: Array<{
    id: number;
    reason: string;
  }>;
  skipped: Array<{
    id: number;
    reason: string;
  }>;
}

export const useDownloadArtistImages = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const downloadImages = async () => {
    try {
      setIsDownloading(true);
      setResult(null);
      setErrorDetails(null);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error('You must be logged in to perform this action');
        logger.error('Download artist images failed: User not logged in');
        return;
      }

      logger.info('Starting artist image download process');
      
      try {
        // Get the Supabase URL directly from the imported client
        const supabaseUrl = supabase.getUrl();
        
        if (!supabaseUrl) {
          throw new Error('Could not determine the Supabase URL');
        }
        
        logger.info(`Using Supabase URL: ${supabaseUrl}`);
        
        const response = await fetch(
          `${supabaseUrl}/functions/v1/download-artist-images`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              regenerateAll: true, // Tell the function to regenerate all images
            }),
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }
        
        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(`API Error: ${responseData.error}`);
        }

        logger.info('Image processing completed successfully', responseData);
        setResult(responseData.results);
        toast.success(`Image processing complete. ${responseData.success} successful, ${responseData.failed} failed, ${responseData.skipped} skipped.`);
        
        // Trigger a refresh of the artists data
        window.location.reload();
      } catch (fetchError: any) {
        const errorMessage = fetchError.message || 'Failed to download artist images';
        setErrorDetails(errorMessage);
        logger.error('Fetch error in downloadImages:', fetchError);
        toast.error(`Failed to download artist images: ${errorMessage}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setErrorDetails(errorMessage);
      logger.error('Unexpected error in downloadImages:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadImages,
    isDownloading,
    result,
    errorDetails,
  };
};
