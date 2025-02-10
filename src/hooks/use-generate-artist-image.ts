
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GenerateImageParams {
  name: string;
  specialty: string;
}

export const useGenerateArtistImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async ({ name, specialty }: GenerateImageParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { name, specialty }
      });

      if (error) throw error;
      
      return data.imageURL;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, error };
};
