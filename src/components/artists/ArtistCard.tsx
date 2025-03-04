
import React, { useState } from "react";
import { Zap, Wand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/data/types/artist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface ArtistCardProps {
  id: number;
  name: string;
  specialty: string;
  image: string;
  city?: string;
  country?: string;
  onSelect: (e: React.MouseEvent) => void;
  onFavoriteToggle: (isFavorite: boolean) => void;
  isFavorite: boolean;
  isFeatured?: boolean;
  bio: string;
  techniques?: string[];
  styles?: string[];
  social_platforms?: string[];
  refreshArtist?: () => void;
}

const ArtistCard = ({ 
  id, 
  name, 
  specialty, 
  image,
  city,
  country,
  onSelect, 
  onFavoriteToggle,
  isFavorite,
  isFeatured = false,
  bio,
  techniques,
  styles,
  social_platforms,
  refreshArtist
}: ArtistCardProps) => {
  const subdomain = `${name.toLowerCase().replace(/\s+/g, '')}.247.art`;
  const location = [city, country].filter(Boolean).join(", ");
  const [imageError, setImageError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error("Artist card image failed to load:", image);
    setImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleGenerateArtistImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info("Generate artist image button clicked from card for artist:", { id, name });
    setIsGenerating(true);
    
    try {
      const prompt = `Professional portrait photograph of a ${specialty} artist named ${name} from ${city || ''} ${country || ''}. ${bio || ''}`;
      
      logger.info("Calling generate-artist-image edge function with prompt:", { artistId: id, promptPreview: prompt.substring(0, 50) + "..." });
      
      const { data, error } = await supabase.functions.invoke('generate-artist-image', {
        body: { 
          artist_id: id, 
          prompt,
          download_image: true // Add this flag to download and store the image
        }
      });
      
      if (error) {
        logger.error('Edge function error details:', error);
        throw new Error(`Edge Function error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.error) {
        const errorDetails = data?.details || 'No details provided';
        logger.error('API response error:', { error: data?.error || 'No data returned', details: errorDetails });
        throw new Error(`${data?.error || 'Failed to generate artist image'}: ${errorDetails}`);
      }
      
      logger.info('Artist image generated successfully from card view:', data);
      toast.success('Artist image generated successfully!');
      
      // If we have a refresh function, use it instead of page reload
      if (refreshArtist) {
        refreshArtist();
      }
    } catch (error: any) {
      logger.error('Error generating artist image from card:', error);
      toast.error(`Failed to generate artist image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to stop event propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <div 
        className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={onSelect}
      >
        {/* Artist Image */}
        <div className="aspect-square overflow-hidden relative">
          <img
            src={imageError ? '/placeholder.svg' : image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
          
          {/* Generate Image Button */}
          <div className="absolute top-2 left-2 z-10" onClick={stopPropagation}>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:border-white/30"
              onClick={handleGenerateArtistImage}
              title="Generate Image"
              disabled={isGenerating}
            >
              <Wand size={isFeatured ? 24 : 20} className={isGenerating ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
        
        {/* Artist Information - Visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div>
              <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
              <p className="text-white/80 text-sm mb-1">{specialty}</p>
              {location && (
                <p className="text-white/70 text-sm mb-1">{location}</p>
              )}
              <p className="text-white/60 text-base font-mono">{subdomain}</p>
            </div>
          </div>
        </div>

        {/* Favorite Button - Always visible at bottom */}
        <div className="absolute bottom-4 right-4 z-10" onClick={stopPropagation}>
          <Button
            variant="ghost"
            size="icon"
            className={`${
              isFavorite 
                ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' 
                : 'bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:border-white/30'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(!isFavorite);
            }}
            title="Favorite"
          >
            <Zap size={isFeatured ? 24 : 20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
