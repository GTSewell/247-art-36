
import React, { useState, useCallback } from "react";
import { Trash2, Image, MoveHorizontal, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
  onSetAsBackground: (artworkUrl: string) => void;
  onReorder?: (newOrder: string[]) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ 
  artworks, 
  onRemove, 
  onSetAsBackground,
  onReorder
}) => {
  const [isDragging, setIsDragging] = useState<number | null>(null);

  const handleMoveUp = (index: number) => {
    if (index <= 0 || !onReorder) return;
    
    const newArtworks = [...artworks];
    const temp = newArtworks[index];
    newArtworks[index] = newArtworks[index - 1];
    newArtworks[index - 1] = temp;
    
    onReorder(newArtworks);
  };

  const handleMoveDown = (index: number) => {
    if (index >= artworks.length - 1 || !onReorder) return;
    
    const newArtworks = [...artworks];
    const temp = newArtworks[index];
    newArtworks[index] = newArtworks[index + 1];
    newArtworks[index + 1] = temp;
    
    onReorder(newArtworks);
  };

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
      {onReorder && (
        <p className="text-sm text-gray-500 mb-4">
          Use the arrow buttons to rearrange the order of artworks. This order is how they'll appear on the artist's profile.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artworks.map((artwork, index) => (
          <div 
            key={index} 
            className={`group relative aspect-square rounded-md overflow-hidden border ${
              isDragging === index ? 'border-primary ring-2 ring-primary' : 'border-gray-200'
            } bg-transparent`}
          >
            <img 
              src={artwork} 
              alt={`Artwork ${index + 1}`} 
              className="w-full h-full object-contain"
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

              {onReorder && (
                <>
                  <Button 
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === artworks.length - 1}
                    title="Move down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {onReorder && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded">
                #{index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;
