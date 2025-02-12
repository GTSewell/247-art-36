
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { useGenerateArtistImage } from "@/hooks/use-generate-artist-image";
import { toast } from "sonner";

export const useArtistRegeneration = () => {
  const { generateImage, isLoading: isGenerating } = useGenerateArtistImage();

  const handleRegenerateArtworks = async (artist: Artist) => {
    if (isGenerating) {
      toast.error("Please wait for the current generation to complete");
      return;
    }

    toast.info(`Generating artworks for ${artist.name}...`);
    
    const artworkUrls = await generateImage({
      name: artist.name,
      specialty: artist.specialty,
      techniques: artist.techniques,
      styles: artist.styles
    });

    if (artworkUrls) {
      const { error: updateError } = await supabase
        .from('artists')
        .update({ artworks: artworkUrls })
        .eq('id', artist.id);

      if (updateError) {
        toast.error("Failed to save artworks");
        return null;
      }

      toast.success(`Artworks generated for ${artist.name}!`);
      return artworkUrls;
    }
    
    return null;
  };

  return {
    handleRegenerateArtworks,
    isGenerating
  };
};
