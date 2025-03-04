
import React, { useState } from 'react';
import { Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Artist } from '@/data/types/artist';
import { logger } from '@/utils/logger';

interface ArtistArtworksViewProps {
  artist: Artist;
  isGeneratingArtworks: boolean;
  setIsGeneratingArtworks: (value: boolean) => void;
  artworkErrors: Record<number, boolean>;
  handleArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => void;
  refreshArtworks?: () => void; // Optional prop to refresh artworks without page reload
}

export const ArtistArtworksView: React.FC<ArtistArtworksViewProps> = ({
  artist,
  isGeneratingArtworks,
  setIsGeneratingArtworks,
  artworkErrors,
  handleArtworkImageError,
  refreshArtworks
}) => {
  const [generatedArtworks, setGeneratedArtworks] = useState<string[]>([]);

  const handleGenerateArtworks = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the card from flipping
    logger.info("Generate artworks button clicked for artist:", { id: artist.id, name: artist.name });
    
    setIsGeneratingArtworks(true);
    try {
      logger.info("Calling generate-artist-image edge function for artworks");
      
      // Parse techniques and styles if they're strings
      let techniques = artist.techniques;
      let styles = artist.styles;
      
      if (typeof techniques === 'string') {
        try {
          techniques = JSON.parse(techniques);
        } catch {
          techniques = [];
        }
      }
      
      if (typeof styles === 'string') {
        try {
          styles = JSON.parse(styles);
        } catch {
          styles = [];
        }
      }
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: artist.id,
          generate_artworks: true,
          count: 4,
          download_images: true, // Flag to indicate we want to download and store the artworks
          techniques,
          styles,
          specialty: artist.specialty
        }
      });
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', { error: data?.error || 'No data returned', details: errorDetails });
        throw new Error(`${data?.error || 'Failed to generate artworks'}: ${errorDetails}`);
      }

      logger.info('Artworks generated successfully:', data);
      
      // Update artwork images locally if available in response
      if (data.artworkUrls && Array.isArray(data.artworkUrls)) {
        setGeneratedArtworks(data.artworkUrls);
        toast.success('Artworks generated successfully!');
      }
      
      // If we have a refresh callback, use it
      if (refreshArtworks) {
        refreshArtworks();
      }
    } catch (error: any) {
      logger.error('Error generating artworks:', error);
      toast.error(`Failed to generate artworks: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingArtworks(false);
    }
  };

  // Helper function to directly stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Helper function to parse artworks if they're stored as a string
  const getArtworks = (): string[] => {
    if (!artist.artworks) return [];
    
    if (typeof artist.artworks === 'string') {
      try {
        return JSON.parse(artist.artworks);
      } catch {
        return [];
      }
    }
    
    return Array.isArray(artist.artworks) ? artist.artworks : [];
  };

  // Determine which artworks to display
  const displayArtworks = generatedArtworks.length > 0 
    ? generatedArtworks 
    : getArtworks();

  return (
    <div className="relative h-full">
      {/* Generate Artworks button - with higher z-index and explicit positioning */}
      <div 
        className="absolute top-2 left-2 right-2 z-50 flex justify-center" 
        onClick={stopPropagation}
        data-button-container="true"
      >
        <Button
          size="sm"
          variant="outline"
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border-white/20 hover:border-white/40 transition-all pointer-events-auto relative"
          onClick={handleGenerateArtworks}
          disabled={isGeneratingArtworks}
        >
          <Wand className={`h-4 w-4 mr-1 ${isGeneratingArtworks ? 'animate-spin' : ''}`} />
          {isGeneratingArtworks ? 'Generating...' : 'Generate Artworks'}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-2 w-full h-full pointer-events-none">
        {displayArtworks.length > 0 ? (
          displayArtworks.slice(0, 4).map((artwork, index) => (
            <div key={index} className="relative aspect-square rounded overflow-hidden pointer-events-none">
              <img
                src={artworkErrors[index] ? '/placeholder.svg' : artwork}
                alt={`Artwork ${index + 1} by ${artist.name}`}
                className="w-full h-full object-cover"
                onError={(e) => handleArtworkImageError(e, index)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center h-full text-gray-500 text-sm italic pointer-events-none">
            No artworks available
          </div>
        )}
      </div>
    </div>
  );
};
