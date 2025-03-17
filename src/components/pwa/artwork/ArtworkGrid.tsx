
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { logger } from "@/utils/logger";

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onRemove }) => {
  const isMobile = useIsMobile();

  if (artworks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You haven't added any artworks yet
      </div>
    );
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    logger.error(`Failed to load artwork image at index ${index}:`, artworks[index]);
    e.currentTarget.src = "/placeholder.svg";
  };

  return (
    <div className={`grid gap-4 mt-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
      {artworks.map((artwork, index) => (
        <div key={index} className="relative group">
          <div className="aspect-square overflow-hidden rounded-md border border-gray-200">
            <img 
              src={artwork} 
              alt={`Artwork ${index + 1}`} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => handleImageError(e, index)}
            />
          </div>
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
