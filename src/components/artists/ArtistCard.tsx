import React, { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/data/types/artist";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";
import { useCardFlip } from "./hooks/useCardFlip";
import { useImageErrors } from "./hooks/useImageErrors";
import ArtistCardFront from "./ArtistCardFront";
import ArtistCardBack from "./ArtistCardBack";

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
  refreshArtist?: (artistId: number) => Promise<Artist | void>;
  showNameOverlay?: boolean;
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
  refreshArtist,
  showNameOverlay = false
}: ArtistCardProps) => {
  const subdomain = `247.art/${name.toLowerCase().replace(/\s+/g, '')}`;
  const location = [city, country].filter(Boolean).join(", ");
  const isMobile = useIsMobile();
  const [isGeneratingArtworks, setIsGeneratingArtworks] = useState(false);

  const { 
    isFlipped, 
    showClickIndicator, 
    handleFlip 
  } = useCardFlip(id);
  
  const { 
    mainImageError, 
    artworkErrors, 
    handleMainImageError, 
    handleArtworkImageError 
  } = useImageErrors(id, name);
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info(`ArtistCard: Toggling favorite for artist ID ${id}, current state: ${isFavorite}`);
    onFavoriteToggle(!isFavorite);
  };

  const artist: Artist = {
    id,
    name,
    specialty,
    image,
    bio,
    city,
    country,
    techniques,
    styles,
    social_platforms,
    published: true
  };
  
  const isSignatureArtist = id >= 26;
  
  const isDemo = id !== 24 && id !== 26;
  
  const refreshArtworks = async () => {
    if (refreshArtist) {
      try {
        await refreshArtist(id);
      } catch (error) {
        logger.error('Error refreshing artworks:', error);
      }
    }
  };

  return (
    <div className="relative">
      <div 
        className={`group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${isSignatureArtist ? 'border-2 border-zap-yellow' : ''}`} 
        onClick={isFlipped ? stopPropagation : onSelect}
      >
        <div className="aspect-square overflow-hidden relative">
          {!isFlipped ? (
            <ArtistCardFront 
              image={image}
              name={name}
              onImageError={handleMainImageError}
            />
          ) : (
            <ArtistCardBack 
              artist={artist}
              isGeneratingArtworks={isGeneratingArtworks}
              setIsGeneratingArtworks={setIsGeneratingArtworks}
              artworkErrors={artworkErrors}
              handleArtworkImageError={handleArtworkImageError}
              refreshArtworks={refreshArtworks}
              onBackClick={handleFlip}
            />
          )}
          
          {isSignatureArtist && (
            <div className="absolute top-3 left-3 z-10 bg-zap-red text-white font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px]">
              Signature Artist
            </div>
          )}
          
          {!isSignatureArtist && isDemo && (
            <div className="absolute top-3 left-3 z-10 bg-[#00baef] text-white font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px]">
              Demo
            </div>
          )}
          
          {showNameOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-3 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${isFavorite ? 'bg-yellow-300 text-black' : 'bg-black/20 text-white'}`} 
                    onClick={handleFavoriteToggle} 
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Zap size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!showNameOverlay && !isFlipped && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div>
                  <h3 className={`${isFeatured ? 'text-xl' : 'text-lg'} font-bold text-white mb-1`}>{name}</h3>
                  <p className="text-white/80 text-sm mb-1">{specialty}</p>
                  {location && <p className="text-white/70 text-sm mb-1">{location}</p>}
                  <p className="text-white/60 text-base font-mono">{subdomain}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10" onClick={stopPropagation}>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isFavorite ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' : 'bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:border-white/30'}`} 
                onClick={handleFavoriteToggle} 
                title={isFavorite ? "Favorited" : "Favorite"} 
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Zap size={isFeatured ? 24 : 20} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
