
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { Artist } from '@/data/types/artist';

interface GenerateOptions {
  artistId: number;
  artistName: string;
  specialty: string;
  bio?: string;
  techniques?: string[] | string;
  styles?: string[] | string;
  downloadImage?: boolean;
  generateArtworks?: boolean;
  artworkCount?: number;
}

export const useArtGeneration = () => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);

  // Utility function to handle parsing arrays stored as strings
  const parseArrayField = (field: string[] | string | undefined): string[] => {
    if (!field) return [];
    
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    
    return field;
  };

  const generateArtistImage = async (options: GenerateOptions): Promise<string | null> => {
    const {
      artistId,
      artistName,
      specialty,
      bio = '',
      downloadImage = true
    } = options;
    
    setIsGeneratingImage(true);
    
    try {
      logger.info("Generating artist image for:", { id: artistId, name: artistName });
      
      const prompt = `Professional portrait photograph of a ${specialty} artist named ${artistName}. ${bio || ''}`;
      
      logger.info("Calling generate-artist-image edge function with prompt:", { promptPreview: prompt.substring(0, 50) + "..." });
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artistId, 
          prompt,
          download_image: downloadImage
        }
      });
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', { error: data?.error || 'No data returned', details: errorDetails });
        throw new Error(`${data?.error || 'Failed to generate artist image'}: ${errorDetails}`);
      }
      
      logger.info('Artist image generated successfully:', data);
      toast.success('Artist image generated successfully!');
      
      return data.imageUrl || null;
    } catch (error: any) {
      logger.error('Error generating artist image:', error);
      toast.error(`Failed to generate artist image: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const generateArtworks = async (options: GenerateOptions): Promise<string[] | null> => {
    const {
      artistId,
      techniques: rawTechniques,
      styles: rawStyles,
      specialty,
      artworkCount = 4,
      downloadImage = true
    } = options;
    
    setIsGeneratingArtworks(true);
    
    try {
      logger.info("Generating artworks for artist:", { id: artistId });
      
      // Parse techniques and styles if needed
      const techniques = parseArrayField(rawTechniques);
      const styles = parseArrayField(rawStyles);
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artistId,
          generate_artworks: true,
          count: artworkCount,
          download_images: downloadImage,
          techniques,
          styles,
          specialty
        }
      });
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', { error: data?.error || 'No data returned', details: errorDetails });
        throw new Error(`${data?.error || 'Failed to generate artworks'}: ${errorDetails}`);
      }
      
      logger.info('Artworks generated successfully:', data);
      toast.success('Artworks generated successfully!');
      
      return data.artworkUrls || null;
    } catch (error: any) {
      logger.error('Error generating artworks:', error);
      toast.error(`Failed to generate artworks: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsGeneratingArtworks(false);
    }
  };
  
  // Function to save the current temporary image as permanent
  const saveArtistImage = async (artistId: number): Promise<boolean> => {
    try {
      logger.info("Saving artist image for artist:", { id: artistId });
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artistId, 
          save: true,
        }
      });
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', { error: data?.error || 'No data returned', details: errorDetails });
        throw new Error(`${data?.error || 'Failed to save artist image'}: ${errorDetails}`);
      }
      
      logger.info('Artist image saved successfully:', data);
      toast.success('Artist image saved!');
      
      return true;
    } catch (error: any) {
      logger.error('Error saving artist image:', error);
      toast.error(`Failed to save artist image: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    generateArtistImage,
    generateArtworks,
    saveArtistImage,
    isGeneratingImage,
    isGeneratingArtworks
  };
};
