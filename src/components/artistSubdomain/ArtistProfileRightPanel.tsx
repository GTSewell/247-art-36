
import React, { useState } from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ArtworkDetails {
  image: string;
  title: string;
  description: string;
  specifications: string;
  price: string;
}

interface ArtistProfileRightPanelProps {
  artist: Artist;
  artworks: string[];
  panelColor: string;
}

const ArtistProfileRightPanel: React.FC<ArtistProfileRightPanelProps> = ({
  artist,
  artworks,
  panelColor
}) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkDetails | null>(null);
  
  // For Demo Artist, use placeholder artworks if none exist
  const placeholderArtworks = artist.name === "Demo Artist" ? [
    "/lovable-uploads/2d358d55-3e32-4df5-b06b-d2c4cc68d85c.png",
    "/lovable-uploads/2d358d55-3e32-4df5-b06b-d2c4cc68d85c.png",
    "/lovable-uploads/2d358d55-3e32-4df5-b06b-d2c4cc68d85c.png",
    "/lovable-uploads/2d358d55-3e32-4df5-b06b-d2c4cc68d85c.png"
  ] : [];
  
  const displayArtworks = artworks.length > 0 
    ? artworks 
    : placeholderArtworks.length > 0
      ? placeholderArtworks
      : Array(4).fill('/placeholder.svg');
  
  const getArtworkDetails = (artworkUrl: string, index: number): ArtworkDetails => {
    return {
      image: artworkUrl,
      title: `${artist.name}'s Artwork ${index + 1}`,
      description: "This stunning piece showcases the artist's unique style and vision, bringing together elements of color, texture, and form in perfect harmony.",
      specifications: `Medium: Acrylic on Canvas\nSize: 24" x 36"\nYear: ${new Date().getFullYear()}`,
      price: `$${Math.floor(Math.random() * 5000) + 1000}`
    };
  };

  const handleArtworkClick = (artwork: string, index: number) => {
    setSelectedArtwork(getArtworkDetails(artwork, index));
    setIsModalOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent the dialog from closing
    e.preventDefault();
    e.stopPropagation();
    
    // Show toast notification
    toast.success("Added to art!", {
      description: `${selectedArtwork?.title} has been added to your collection.`
    });
  };
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      {isMobile && (
        <div className="flex items-start mb-4">
          <div className="mr-4">
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={artist.image || '/placeholder.svg'} 
                alt={artist.name || 'Artist'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">{artist.name}</h2>
            <p className="text-sm text-gray-600">{artist.specialty}</p>
            <p className="text-xs text-gray-500">
              {artist.city}{artist.city && artist.country ? ', ' : ''}{artist.country}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-hidden">
        <h3 className="text-base font-bold mb-3">Featured Artworks</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="flex flex-col space-y-4 pr-4 pb-4">
            {displayArtworks.map((artwork, index) => (
              <div 
                key={index}
                className="min-h-fit rounded-md overflow-hidden shadow-sm relative group cursor-pointer"
              >
                <img 
                  src={artwork} 
                  alt={`Artwork ${index + 1}`}
                  className="w-full object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center"
                  onClick={() => handleArtworkClick(artwork, index)}
                >
                  <div className="absolute bottom-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon"
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white text-black border border-black shadow-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArtworkClick(artwork, index);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md" style={{ backgroundColor: panelColor }}>
          <DialogHeader>
            <DialogTitle>{selectedArtwork?.title}</DialogTitle>
            <DialogDescription>
              {selectedArtwork?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="rounded-md overflow-hidden mb-4">
              {selectedArtwork && (
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title}
                  className="w-full object-cover"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Specifications</h4>
              <p className="text-sm whitespace-pre-line">{selectedArtwork?.specifications}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-lg">{selectedArtwork?.price}</span>
              <Button 
                onClick={handleAddToCart}
                className="bg-[#95B3D2] hover:bg-[#7A9CC2] text-white transition-colors rounded-lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Art
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistProfileRightPanel;
