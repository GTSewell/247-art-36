
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { Artist } from '@/data/types/artist';

export const useGenerateIndividualArtistImage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (artist: Artist) => {
    try {
      setIsGenerating(true);
      setGeneratedImage(null);
      setError(null);
      
      // Check authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error('You must be logged in to generate images');
        logger.error('Generate image failed: User not logged in');
        return;
      }

      // Prepare prompt based on artist details
      const prompt = createPromptFromArtist(artist);
      logger.info(`Generating image for artist ${artist.id} with prompt: ${prompt}`);
      
      // Call Supabase Edge Function
      const supabaseUrl = "https://iqmskopbhrzqqqjewdzv.supabase.co";
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-artist-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            artistId: artist.id,
            preview: true // Flag to indicate this is a preview (not saving to DB yet)
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

      logger.info('Image generated successfully', responseData);
      setGeneratedImage(responseData.imageUrl);
      toast.success('Artist image generated successfully');
      
      return responseData.imageUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate artist image';
      setError(errorMessage);
      logger.error('Error generating artist image:', err);
      toast.error(`Failed to generate image: ${errorMessage}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedImage = async (artist: Artist, imageUrl: string) => {
    try {
      setIsGenerating(true);
      
      // Check authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error('You must be logged in to save images');
        logger.error('Save image failed: User not logged in');
        return false;
      }

      logger.info(`Saving generated image for artist ${artist.id}`);
      
      // Call Supabase Edge Function to save the image
      const supabaseUrl = "https://iqmskopbhrzqqqjewdzv.supabase.co";
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-artist-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl,
            artistId: artist.id,
            preview: false // Flag to indicate this is a final save
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

      logger.info('Image saved successfully', responseData);
      toast.success('Artist image saved to database');

      // Trigger a refresh of artists data
      window.dispatchEvent(new CustomEvent('refreshArtists'));
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save artist image';
      setError(errorMessage);
      logger.error('Error saving artist image:', err);
      toast.error(`Failed to save image: ${errorMessage}`);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const createPromptFromArtist = (artist: Artist): string => {
    // Create a detailed prompt based on the artist's profile
    const parts: string[] = [];
    
    parts.push(`Professional portrait of ${artist.name}`);
    
    if (artist.specialty) {
      parts.push(`who is a ${artist.specialty}`);
    }
    
    if (artist.city && artist.country) {
      parts.push(`from ${artist.city}, ${artist.country}`);
    } else if (artist.city || artist.country) {
      parts.push(`from ${artist.city || artist.country}`);
    }
    
    // Add art styles if available
    if (artist.styles && artist.styles.length > 0) {
      parts.push(`working in ${artist.styles.join(', ')} style`);
    }
    
    // Add techniques if available
    if (artist.techniques && artist.techniques.length > 0) {
      parts.push(`using ${artist.techniques.join(', ')} techniques`);
    }
    
    // Add a generic artistic description
    parts.push("professional artistic photo, high quality, detailed, 4k");
    
    return parts.join(' ');
  };

  return {
    generateImage,
    saveGeneratedImage,
    isGenerating,
    generatedImage,
    error,
    createPromptFromArtist
  };
};
