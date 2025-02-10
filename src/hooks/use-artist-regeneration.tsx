
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

  return {
    handleRegenerateImage,
    isGenerating
  };
};
