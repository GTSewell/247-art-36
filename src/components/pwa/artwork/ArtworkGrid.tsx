
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onRemove }) => {
  console.log("Artwork Grid received artworks:", artworks);

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading image:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder.svg";
    toast.error("Failed to load artwork image");
  };
  
  return (
    <div>
      {artworks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {artworks.map((artwork, index) => (
            <Card key={index} className="overflow-hidden group relative">
              <div className="aspect-square">
                <img 
                  src={artwork} 
                  alt={`Artwork ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No artworks uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload artworks using the button above
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtworkGrid;
