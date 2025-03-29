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
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info(`ArtistCard: Toggling favorite for artist ID ${id}, current state: ${isFavorite}`);
    onFavoriteToggle(!isFavorite);
  };

  // Check if artist is a Genesis Artist (ID >= 26)
  const isGenesisArtist = id >= 26;
  return <div className="relative">
      <div className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer" onClick={onSelect}>
        <div className="aspect-square overflow-hidden relative">
          <img src={imageError ? '/placeholder.svg' : image} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" onError={handleImageError} />
          
          {/* Signature Artist Badge */}
          {isGenesisArtist && <div className="absolute top-3 left-3 z-10 bg-zap-red text-[#ffffff] font-bold text-lg shadow-md rounded-lg py-[2px] px-[10px]">
              Signature Artist
            </div>}
          
          {/* Name overlay for PWA */}
          {showNameOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-3 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <Button variant="ghost" size="icon" className={`h-8 w-8 ${isFavorite ? 'bg-yellow-300 text-black' : 'bg-black/20 text-white'}`} onClick={handleFavoriteToggle} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                    <Zap size={16} />
                  </Button>
                </div>
              </div>
            </div>}
        </div>
        
        {!showNameOverlay && <>
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
              <Button variant="ghost" size="icon" className={`${isFavorite ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90' : 'bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white border border-white/10 hover:border-white/30'}`} onClick={handleFavoriteToggle} title={isFavorite ? "Favorited" : "Favorite"} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <Zap size={isFeatured ? 24 : 20} />
              </Button>
            </div>
          </>}
      </div>
    </div>;
};
export default ArtistCard;