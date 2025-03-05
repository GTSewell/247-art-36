
import React, { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artist } from "@/data/types/artist";
import { useIsMobile } from "@/hooks/use-mobile";
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
  refreshArtist?: (artistId: number) => Promise<Artist | void>;
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
  const subdomain = `247.art/${name.toLowerCase().replace(/\s+/g, '')}`;
  const location = [city, country].filter(Boolean).join(", ");
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    logger.error("Artist card image failed to load:", image);
    setImageError(true);
    e.currentTarget.src = '/placeholder.svg';
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <div 
        className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={onSelect}
      >
        <div className="aspect-square overflow-hidden relative">
          <img
            src={imageError ? '/placeholder.svg' : image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
        
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
            title={isFavorite ? "Favorited" : "Favorite"}
          >
            <Zap size={isFeatured ? 24 : 20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
