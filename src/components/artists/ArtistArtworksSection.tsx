
import React from "react";
import { RefreshCw, SaveAll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/data/types/artist";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArtistArtworksSectionProps {
  artist: Artist;
  onRegenerateArtworks?: (artist: Artist) => Promise<void>;
  isGenerating: boolean;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
}

const ArtistArtworksSection = ({ 
  artist, 
  onRegenerateArtworks,
  isGenerating,
  isSaving,
  setIsSaving
}: ArtistArtworksSectionProps) => {
  const handleSaveArtworks = async () => {
    if (!artist.artworks || artist.artworks.length === 0) {
      toast.error("No artworks to save!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('artists')
        .update({ 
          locked_artworks: true,
          artworks: artist.artworks
        })
        .eq('id', artist.id);

      if (error) throw error;
      
      toast.success("Artworks saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error('Error saving artworks:', error);
      toast.error("Failed to save artworks");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Artworks</h3>
        {!artist.locked_artworks && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveArtworks}
              disabled={isSaving || !artist.artworks?.length}
              className="flex items-center gap-2"
            >
              <SaveAll className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerateArtworks?.(artist)}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Artworks'}
            </Button>
          </div>
        )}
      </div>
      {artist.artworks && artist.artworks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {artist.artworks.map((artwork, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border/40">
              <img
                src={artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm italic">No artworks generated yet. Click the button above to generate some!</p>
      )}
    </div>
  );
};

export default ArtistArtworksSection;
