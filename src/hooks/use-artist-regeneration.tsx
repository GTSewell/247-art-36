
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { useGenerateArtistImage } from "@/hooks/use-generate-artist-image";
import { toast } from "sonner";

export const useArtistRegeneration = () => {
  const { generateImage, isLoading: isGenerating } = useGenerateArtistImage();

  const handleRegenerateImage = async (artist: Artist) => {
    if (isGenerating) {
      toast.error("Please wait for the current generation to complete");
      return;
    }

    toast.info(`Generating new profile image for ${artist.name}...`);
    const imageUrl = await generateImage({
      name: artist.name,
      specialty: artist.specialty
    });

    if (imageUrl) {
      const { error } = await supabase
        .from('artists')
        .update({ image: imageUrl })
        .eq('id', artist.id);

      if (error) {
        toast.error('Failed to update artist image');
        return;
      }
      
      toast.success(`New profile image generated for ${artist.name}!`);
      return imageUrl;
    }
  };

  const handleRegenerateArtworks = async (artist: Artist) => {
    if (isGenerating) {
      toast.error("Please wait for the current generation to complete");
      return;
    }

    toast.info(`Generating new artworks for ${artist.name}...`);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          name: artist.name,
          specialty: artist.specialty,
          techniques: artist.techniques,
          styles: artist.styles
        }
      });

      if (error) throw error;

      if (data?.artworkUrls) {
        const { error: updateError } = await supabase
          .from('artists')
          .update({ artworks: data.artworkUrls })
          .eq('id', artist.id);

        if (updateError) throw updateError;

        toast.success(`New artworks generated for ${artist.name}!`);
        return data.artworkUrls;
      }
    } catch (error) {
      console.error('Error generating artworks:', error);
      toast.error('Failed to generate artworks');
      return null;
    }
  };

  return {
    handleRegenerateImage,
    handleRegenerateArtworks,
    isGenerating
  };
};
