
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBulkArtistRegeneration = () => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const regenerateAllArtistImages = async () => {
    setIsRegenerating(true);
    toast.info('Starting bulk image regeneration...');

    try {
      const { data, error } = await supabase.functions.invoke('bulk-regenerate-artist-images');

      if (error) {
        throw error;
      }

      toast.success(`${data.message}`);
      return data.results;
    } catch (error) {
      console.error('Error in bulk regeneration:', error);
      toast.error('Failed to regenerate images');
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  return {
    regenerateAllArtistImages,
    isRegenerating
  };
};
