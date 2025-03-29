
import React from "react";
import { RefreshCw, SaveAll, Wand } from "lucide-react";
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
    // Get the artworks, ensuring it's an array
    const artworksArray = Array.isArray(artist.artworks) 
      ? artist.artworks 
      : typeof artist.artworks === 'string' && artist.artworks
        ? JSON.parse(artist.artworks)
        : [];
        
    if (!artworksArray || artworksArray.length === 0) {
      toast.error("No artworks to save!");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('artists')
        .update({ 
          locked_artworks: true,
          artworks: artworksArray
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

  const handleGenerateArtworks = async () => {
    if (onRegenerateArtworks) {
      await onRegenerateArtworks(artist);
      return;
    }
    
    // Direct generation through the edge function
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          generate_artworks: true,
          count: 4
        }
      });
      
      if (error) throw error;
      
      toast.success('Artworks generated successfully!');
      // Force reload to show the new artworks
      window.location.reload();
    } catch (error) {
      console.error('Error generating artworks:', error);
      toast.error('Failed to generate artworks');
    }
  };

  // Process artworks to ensure it's always an array
  const artworksArray = Array.isArray(artist.artworks) 
    ? artist.artworks 
    : typeof artist.artworks === 'string' && artist.artworks
      ? JSON.parse(artist.artworks)
      : [];

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
              disabled={isSaving || !artworksArray.length}
              className="flex items-center gap-2"
            >
              <SaveAll className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateArtworks}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Wand className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Artworks'}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {artworksArray && artworksArray.length > 0 ? (
          artworksArray.map((artwork, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border/40">
              <img
                src={artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground text-sm italic">
            {isGenerating ? 'Generating artworks...' : 'No artworks generated yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistArtworksSection;
