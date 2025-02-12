
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

    console.log("Starting artwork regeneration for artist:", artist);
    toast.info(`Generating artworks for ${artist.name}...`);
    
    try {
      const artworkUrls = await generateImage({
        name: artist.name,
        specialty: artist.specialty,
        techniques: artist.techniques,
        styles: artist.styles
      });

      if (!artworkUrls || !Array.isArray(artworkUrls)) {
        console.error("Invalid artwork URLs format:", artworkUrls);
        toast.error("Failed to generate artworks");
        return null;
      }

      console.log("Got artwork URLs:", artworkUrls);

      // Ensure URLs array is a proper array and not empty
      if (artworkUrls.length === 0) {
        console.error("Generated artwork URLs array is empty");
        toast.error("Failed to generate artworks - Empty array");
        return null;
      }

      // First, perform the update operation
      const { error: updateError } = await supabase
        .from('artists')
        .update({
          artworks: artworkUrls,
          locked_artworks: false
        })
        .eq('id', artist.id);

      if (updateError) {
        console.error("Error updating artist:", updateError);
        toast.error("Failed to save artworks");
        return null;
      }

      // Then, fetch the updated record
      const { data: updatedArtist, error: fetchError } = await supabase
        .from('artists')
        .select('id, name, artworks')
        .eq('id', artist.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching updated artist:", fetchError);
        toast.error("Failed to verify artwork update");
        return null;
      }

      if (!updatedArtist) {
        console.error("No artist found after update");
        toast.error("Failed to save artworks - Artist not found");
        return artworkUrls; // Return the generated URLs even if we can't fetch the updated record
      }

      console.log("Successfully updated artist:", updatedArtist);
      toast.success(`Artworks generated for ${artist.name}!`);
      return updatedArtist.artworks;
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
