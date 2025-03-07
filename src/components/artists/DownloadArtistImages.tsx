
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const DownloadArtistImages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    skipped: number;
  } | null>(null);

  const handleDownloadImages = async () => {
    try {
      setIsLoading(true);
      setResults(null);
      
      // Call the Supabase function to download and store all artist images
      const { data, error } = await supabase.functions.invoke('download-artist-images', {
        body: { regenerateAll: false }
      });
      
      if (error) {
        throw error;
      }
      
      logger.info('Download results:', data);
      
      if (data) {
        setResults({
          success: data.success || 0,
          failed: data.failed || 0,
          skipped: data.skipped || 0
        });
        
        toast.success(`Successfully processed ${data.success} artists!`);
      }
    } catch (error: any) {
      logger.error('Error downloading artist images:', error);
      toast.error(`Failed to download artist images: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-2">Download Artist Images to Storage</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will download all artist profile and artwork images and save them to Supabase Storage to prevent URL expiration issues.
      </p>
      
      <div className="flex space-x-4 items-center">
        <Button onClick={handleDownloadImages} disabled={isLoading} variant="default">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing...' : 'Download All Images'}
        </Button>
        
        {results && (
          <div className="text-sm">
            <span className="font-medium text-green-600">Success: {results.success}</span>
            {results.failed > 0 && (
              <span className="ml-2 font-medium text-red-600">Failed: {results.failed}</span>
            )}
            {results.skipped > 0 && (
              <span className="ml-2 font-medium text-amber-600">Skipped: {results.skipped}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadArtistImages;
