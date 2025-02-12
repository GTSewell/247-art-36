
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

      // Log the exact data we're trying to update
      const updateData = {
        artworks: artworkUrls,
        locked_artworks: false
      };
      console.log("Attempting to update artist with data:", updateData);

      // Perform the update operation
      const { data, error: updateError } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artist.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error("Error updating artist:", updateError);
        toast.error(`Failed to save artworks: ${updateError.message}`);
        return null;
      }

      if (!data) {
        console.error("No artist data returned after update");
        toast.error("Failed to save artworks - No data returned");
        return artworkUrls;
      }

      // Verify the update was successful
      const { data: verifiedArtist, error: verifyError } = await supabase
        .from('artists')
        .select('id, name, artworks')
        .eq('id', artist.id)
        .maybeSingle();

      if (verifyError) {
        console.error("Error verifying artist update:", verifyError);
        toast.error("Failed to verify artwork update");
        return artworkUrls;
      }

      if (!verifiedArtist?.artworks) {
        console.error("Artworks not found in verified artist data");
        return artworkUrls;
      }

      console.log("Successfully updated artist:", verifiedArtist);
      toast.success(`Artworks generated for ${artist.name}!`);
      return verifiedArtist.artworks;
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
