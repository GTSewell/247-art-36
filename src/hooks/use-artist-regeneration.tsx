
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
    
    try {
      const artworkUrls = await generateImage({
        name: artist.name,
        specialty: artist.specialty,
        techniques: artist.techniques,
        styles: artist.styles
      });

      if (!artworkUrls) {
        toast.error("Failed to generate artworks");
        return null;
      }

      console.log("Got artwork URLs:", artworkUrls);
      
      // Update the artist in the database with new artworks
      const { error: updateError } = await supabase
        .from('artists')
        .update({ 
          artworks: artworkUrls,
          locked_artworks: false // Reset locked status when generating new artworks
        })
        .eq('id', artist.id);

      if (updateError) {
        console.error("Error updating artist:", updateError);
        toast.error("Failed to save artworks");
        return null;
      }

      // Fetch the updated artist data
      const { data: updatedArtist, error: fetchError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artist.id)
        .single();

      if (fetchError) {
        console.error("Error fetching updated artist:", fetchError);
        toast.error("Failed to retrieve updated artist data");
        return null;
      }

      toast.success(`Artworks generated for ${artist.name}!`);
      return updatedArtist.artworks || null;
    } catch (error) {
      console.error("Error in handleRegenerateArtworks:", error);
      toast.error("Failed to generate or save artworks");
      return null;
    }
  };

  return {
    handleRegenerateArtworks,
    isGenerating
  };
};
