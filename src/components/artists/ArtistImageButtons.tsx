
import React from 'react';
import { Wand, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Artist } from '@/data/types/artist';
import { logger } from '@/utils/logger';

interface ArtistImageButtonsProps {
  artist: Artist;
  isGeneratingImage: boolean;
  isSavingImage: boolean;
  setIsGeneratingImage: (value: boolean) => void;
  setIsSavingImage: (value: boolean) => void;
}

export const ArtistImageButtons: React.FC<ArtistImageButtonsProps> = ({
  artist,
  isGeneratingImage,
  isSavingImage,
  setIsGeneratingImage,
  setIsSavingImage
}) => {
  const handleGenerateArtistImage = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the card from flipping
    logger.info("Generate artist image button clicked for artist:", { id: artist.id, name: artist.name });
    
    setIsGeneratingImage(true);
    try {
      const prompt = `Professional portrait photograph of a ${artist.specialty} artist named ${artist.name} from ${artist.city || ''} ${artist.country || ''}. ${artist.bio || ''}`;
      
      logger.info("Calling generate-artist-image edge function with prompt:", { artistId: artist.id, promptPreview: prompt.substring(0, 50) + "..." });
      
      const { data, error, status } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          prompt,
          download_image: true
        }
      });
      
      logger.info('Edge function response status:', status);
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'} (Status: ${status})`);
      }
      
      if (status !== 200) {
        logger.error('Edge function returned non-200 status code:', status);
        throw new Error(`Edge Function returned a non-2xx status code: ${status}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', data?.error || 'No data returned', errorDetails);
        throw new Error(`${data?.error || 'Failed to generate artist image'}: ${errorDetails}`);
      }
      
      logger.info('Artist image generation successful:', data);
      toast.success('Artist image generated successfully!');
      // Force reload to show the new temp image
      window.location.reload();
    } catch (error: any) {
      logger.error('Error generating artist image:', error);
      toast.error(`Failed to generate artist image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveArtistImage = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the card from flipping
    logger.info("Save artist image button clicked for artist:", { id: artist.id, name: artist.name });
    
    setIsSavingImage(true);
    try {
      logger.info("Calling generate-artist-image edge function with save flag");
      
      const { data, error, status } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          save: true,
          download_image: true // Flag to indicate we want to download and store the image
        }
      });
      
      logger.info('Edge function response status:', status);
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'} (Status: ${status})`);
      }
      
      if (status !== 200) {
        logger.error('Edge function returned non-200 status code:', status);
        throw new Error(`Edge Function returned a non-2xx status code: ${status}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', data?.error || 'No data returned', errorDetails);
        throw new Error(`${data?.error || 'Failed to save artist image'}: ${errorDetails}`);
      }
      
      logger.info('Artist image saved successfully:', data);
      toast.success('Artist image saved to Supabase storage!');
      // Force reload to show the saved image
      window.location.reload();
    } catch (error: any) {
      logger.error('Error saving artist image:', error);
      toast.error(`Failed to save artist image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div 
      className="absolute top-2 left-2 right-2 z-20 flex gap-2 justify-between" 
      onClick={e => e.stopPropagation()}
    >
      <Button
        size="sm"
        variant="outline"
        className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
        onClick={handleGenerateArtistImage}
        disabled={isGeneratingImage}
      >
        <Wand className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
        {isGeneratingImage ? 'Generating...' : 'Generate'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
        onClick={handleSaveArtistImage}
        disabled={isSavingImage}
      >
        <Save className="h-4 w-4" />
        {isSavingImage ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};
