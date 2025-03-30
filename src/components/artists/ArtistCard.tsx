
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";
import { useCardFlip } from "./hooks/useCardFlip";
import { useImageErrors } from "./hooks/useImageErrors";
import ArtistCardFront from "./ArtistCardFront";
import ArtistCardBack from "./ArtistCardBack";
import ArtistCardNameOverlay from "./ArtistCardNameOverlay";
import ArtistCardHoverOverlay from "./ArtistCardHoverOverlay";
import ArtistBadges from "./ArtistBadges";

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
          
          <ArtistBadges 
            isSignatureArtist={isSignatureArtist} 
            isDemo={isDemo} 
            position="top-left"
          />
          
          {showNameOverlay && (
            <ArtistCardNameOverlay 
              name={name} 
              isFavorite={isFavorite} 
              onFavoriteToggle={handleFavoriteToggle} 
            />
          )}
        </div>
        
        {!showNameOverlay && !isFlipped && (
          <ArtistCardHoverOverlay 
            name={name}
            specialty={specialty}
            location={location}
            subdomain={subdomain}
            isFavorite={isFavorite}
            isFeatured={isFeatured}
            onFavoriteToggle={handleFavoriteToggle}
            stopPropagation={stopPropagation}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
