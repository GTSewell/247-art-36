
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ArtworkGridProps {
  artworks: string[];
  onRemoveArtwork: (index: number) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onRemoveArtwork }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You haven't added any artworks yet
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {artworks.map((artwork, index) => (
        <div key={index} className="relative group">
          <img 
            src={artwork} 
            alt={`Artwork ${index + 1}`} 
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemoveArtwork(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;
