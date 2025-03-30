
import React from "react";
import { Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
  onSetAsBackground: (artworkUrl: string) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onRemove, onSetAsBackground }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="flex justify-center mb-2">
          <Image className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500">No artworks uploaded yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload artworks using the form above</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium mb-3">Uploaded Artworks</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artworks.map((artwork, index) => (
          <div 
            key={index} 
            className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100"
          >
            <img 
              src={artwork} 
              alt={`Artwork ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onRemove(index)}
                title="Remove artwork"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onSetAsBackground(artwork)}
                title="Set as artist profile image"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;
