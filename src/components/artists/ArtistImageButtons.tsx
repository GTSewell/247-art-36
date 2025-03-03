
import React from 'react';
import { Wand, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Artist } from '@/data/types/artist';

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
    console.log("Generate artist image button clicked");
    
    setIsGeneratingImage(true);
    try {
      const prompt = `Professional portrait photograph of a ${artist.specialty} artist named ${artist.name} from ${artist.city || ''} ${artist.country || ''}. ${artist.bio || ''}`;
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          prompt,
          download_image: true
        }
      });
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast.success('Artist image generated successfully!');
      // Force reload to show the new temp image
      window.location.reload();
    } catch (error) {
      console.error('Error generating artist image:', error);
      toast.error('Failed to generate artist image. Please try again later.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveArtistImage = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the card from flipping
    console.log("Save artist image button clicked");
    
    setIsSavingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          save: true,
          download_image: true // Flag to indicate we want to download and store the image
        }
      });
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast.success('Artist image saved to Supabase storage!');
      // Force reload to show the saved image
      window.location.reload();
    } catch (error) {
      console.error('Error saving artist image:', error);
      toast.error('Failed to save artist image. Please try again later.');
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
