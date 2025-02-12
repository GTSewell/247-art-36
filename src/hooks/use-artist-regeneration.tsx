
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
      // First verify the artist exists
      const { data: existingArtist, error: checkError } = await supabase
        .from('artists')
        .select()
        .eq('id', artist.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking artist:", checkError);
        toast.error("Failed to verify artist");
        return null;
      }

      if (!existingArtist) {
        console.error("Artist not found in database:", artist.id);
        toast.error("Artist not found in database");
        return null;
      }

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

      // Convert URLs array to proper PostgreSQL array format
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

      // Then fetch the updated artist to verify the save
      const { data: updatedArtist, error: fetchError } = await supabase
        .from('artists')
        .select()
        .eq('id', artist.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching updated artist:", fetchError);
        toast.error("Failed to verify artwork save");
        return null;
      }

      if (!updatedArtist) {
        console.error("Failed to fetch updated artist:", artist.id);
        toast.error("Failed to verify artwork save");
        return null;
      }

      // Verify that artworks were actually saved
      if (!updatedArtist.artworks || updatedArtist.artworks.length === 0) {
        console.error("Artworks array is empty after save:", updatedArtist);
        toast.error("Failed to save artworks - Array is empty");
        return null;
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
