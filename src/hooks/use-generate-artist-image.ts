
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerateImageParams {
  name: string;
  specialty: string;
  techniques?: string[];
  styles?: string[];
}

export const useGenerateArtistImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (params: GenerateImageParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: params
      });

      if (error) throw error;
      
      if (!data?.artworkUrls || !Array.isArray(data.artworkUrls)) {
        throw new Error('No artwork URLs returned');
      }

      console.log('Generated artwork URLs:', data.artworkUrls);
      return data.artworkUrls;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate artworks';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, error };
};
