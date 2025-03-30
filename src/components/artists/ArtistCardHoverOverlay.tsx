
import React from 'react';
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtistCardHoverOverlayProps {
  name: string;
  specialty: string;
  location: string;
  subdomain: string;
  isFavorite: boolean;
  isFeatured?: boolean;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  stopPropagation: (e: React.MouseEvent) => void;
}

const ArtistCardHoverOverlay: React.FC<ArtistCardHoverOverlayProps> = ({
  name,
  specialty,
  location,
  subdomain,
  isFavorite,
  isFeatured = false,
  onFavoriteToggle,
  stopPropagation
}) => {
  return (
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
          onClick={onFavoriteToggle} 
          title={isFavorite ? "Favorited" : "Favorite"} 
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Zap size={isFeatured ? 24 : 20} />
        </Button>
      </div>
    </>
  );
};

export default ArtistCardHoverOverlay;
