
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkDetails | null>(null);
  
  // If no artworks are provided, display placeholder images
  const displayArtworks = artworks.length > 0 
    ? artworks 
    : Array(4).fill('/placeholder.svg');
  
  // Mock artwork details - in a real app, these would come from the database
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

  const handleAddToCart = () => {
    setIsModalOpen(false);
    
    // Display toast notification
    toast({
      title: "Added to cart",
      description: `${selectedArtwork?.title} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="flex flex-col h-full p-5" style={{ backgroundColor: panelColor }}>
      {/* Only show the header section on mobile */}
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
      
      {/* Artworks Section with ScrollArea */}
      <div className="flex-grow overflow-hidden">
        <h3 className="text-base font-bold mb-3">Featured Artworks</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="flex flex-col space-y-4 pr-4 pb-4">
            {displayArtworks.map((artwork, index) => (
              <div 
                key={index}
                className="min-h-fit rounded-md overflow-hidden shadow-sm relative group"
              >
                <img 
                  src={artwork} 
                  alt={`Artwork ${index + 1}`}
                  className="w-full object-cover"
                />
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  onClick={() => handleArtworkClick(artwork, index)}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white text-black border-black hover:bg-gray-100"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Artwork Details Modal */}
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
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistProfileRightPanel;
