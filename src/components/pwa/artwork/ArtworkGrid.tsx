
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Image } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface ArtworkGridProps {
  artworks: string[];
  onRemove: (index: number) => void;
  onSetAsBackground?: (artworkUrl: string) => void;
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ 
  artworks, 
  onRemove,
  onSetAsBackground
}) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50">
        <p className="text-muted-foreground">No artworks uploaded yet.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium mb-3">Uploaded Artworks</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artworks.map((artwork, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-md overflow-hidden border bg-muted">
              <img 
                src={artwork}
                alt={`Artwork ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {onSetAsBackground && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white text-black border border-gray-200 shadow-md hover:bg-gray-100"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Set as Background Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to use this artwork as the artist profile background image?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onSetAsBackground(artwork)}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this artwork? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onRemove(index)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;
