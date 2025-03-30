
import React from 'react';
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtistCardNameOverlayProps {
  name: string;
  isFavorite: boolean;
  onFavoriteToggle: (e: React.MouseEvent) => void;
}

const ArtistCardNameOverlay: React.FC<ArtistCardNameOverlayProps> = ({
  name,
  isFavorite,
  onFavoriteToggle
}) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
      <div className="p-3 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isFavorite ? 'bg-yellow-300 text-black' : 'bg-black/20 text-white'}`} 
            onClick={onFavoriteToggle} 
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Zap size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCardNameOverlay;
