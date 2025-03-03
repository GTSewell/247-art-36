
import React from 'react';
import { Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Artist } from '@/data/types/artist';

interface ArtistArtworksViewProps {
  artist: Artist;
  isGeneratingArtworks: boolean;
  setIsGeneratingArtworks: (value: boolean) => void;
  artworkErrors: Record<number, boolean>;
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => void;
}

export const ArtistArtworksView: React.FC<ArtistArtworksViewProps> = ({
  artist,
  isGeneratingArtworks,
  setIsGeneratingArtworks,
  artworkErrors,
  handleArtworkImageError
}) => {
  const handleGenerateArtworks = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the card from flipping
    console.log("Generate artworks button clicked");
    
    setIsGeneratingArtworks(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id, 
          generate_artworks: true,
          count: 4,
          download_images: true // Flag to indicate we want to download and store the artworks
        }
      });
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast.success('Artworks generated and saved to storage!');
      // Force reload to show the new artworks
      window.location.reload();
    } catch (error) {
      console.error('Error generating artworks:', error);
      toast.error('Failed to generate artworks. Please try again later.');
    } finally {
      setIsGeneratingArtworks(false);
    }
  };

  // Helper function to directly stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative h-full">
      {/* Generate Artworks button */}
      <div 
        className="absolute top-2 left-2 right-2 z-20 flex justify-center" 
        onClick={stopPropagation}
      >
        <Button
          size="sm"
          variant="outline"
          className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/60"
          onClick={handleGenerateArtworks}
          disabled={isGeneratingArtworks}
        >
          <Wand className={`h-4 w-4 ${isGeneratingArtworks ? 'animate-spin' : ''}`} />
          {isGeneratingArtworks ? 'Generating...' : 'Generate Artworks'}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
        {Array.isArray(artist.artworks) && artist.artworks.length > 0 ? (
          artist.artworks.slice(0, 4).map((artwork, index) => (
            <div key={index} className="relative aspect-square rounded overflow-hidden">
              <img
                src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover"
                onError={(e) => handleArtworkImageError(e, index)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic">
            No artworks available
          </div>
        )}
      </div>
    </div>
  );
};
