
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const downloadImages = async () => {
    try {
      setIsDownloading(true);
      setResult(null);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error('You must be logged in to perform this action');
        return;
      }

      const { data, error } = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-artist-images`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      ).then(res => res.json());

      if (error) {
        toast.error('Failed to download artist images');
        console.error('Error downloading artist images:', error);
        return;
      }

      setResult(data.results);
      toast.success(`Image processing complete. ${data.success} successful, ${data.failed} failed, ${data.skipped} skipped.`);
      
      // Trigger a refresh of the artists data
      window.location.reload();
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error in downloadImages:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadImages,
    isDownloading,
    result,
  };
};
