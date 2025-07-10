import React from 'react';
import { Eye } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ArtworkGridProps {
  validArtworks: string[];
  onArtworkClick: (artwork: string, index: number) => void;
  onArtworkImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number, artwork: string) => void;
  onRemoveArtwork: (artwork: string) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  validArtworks,
  onArtworkClick,
  onArtworkImageError,
  onRemoveArtwork
}) => {
  return (
    <div className="flex-grow overflow-hidden">
      <h3 className="text-base font-bold mb-3">Featured Artworks</h3>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="flex flex-col space-y-4 pr-4 pb-4">
          {validArtworks.length > 0 ? (
            validArtworks.map((artwork, index) => (
              <div 
                key={index}
                className="min-h-fit rounded-md overflow-hidden shadow-sm relative group cursor-pointer"
              >
                <img 
                  src={artwork} 
                  alt={`Artwork ${index + 1}`}
                  className="w-full object-cover"
                  onError={(e) => {
                    onArtworkImageError(e, index, artwork);
                    onRemoveArtwork(artwork);
                  }}
                />
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center"
                  onClick={() => onArtworkClick(artwork, index)}
                >
                  <div className="absolute bottom-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon"
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white text-black border border-black shadow-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtworkClick(artwork, index);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No artworks available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtworkGrid;