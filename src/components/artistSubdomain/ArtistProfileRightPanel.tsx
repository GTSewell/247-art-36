
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
import { X, Eye, ShoppingCart } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useImageErrors } from '@/components/artists/hooks/useImageErrors';
import { useAssignedProducts } from '@/hooks/useAssignedProducts';

interface ArtworkDetails {
  image: string;
  title: string;
  description: string;
  specifications: {
    medium: string;
    size: string;
    year: string;
  };
  price?: string;
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
  const { addItem } = useCart();
  const { artworkErrors, handleArtworkImageError } = useImageErrors(
    artist.id || 0, 
    artist.name || 'Unknown Artist'
  );
  const { products: assignedProducts } = useAssignedProducts(artist.id || null);
  
  // State to track valid artworks (not broken)
  const [validArtworks, setValidArtworks] = useState<string[]>([]);
  
  // Process and filter artworks when they change or errors are detected
  useEffect(() => {
    // Filter out empty, invalid URLs, and known broken images
    const filtered = artworks.filter((url, index) => {
      return url && 
             typeof url === 'string' && 
             url.trim() !== '' && 
             !artworkErrors[index];
    });
    
    setValidArtworks(filtered);
  }, [artworks, artworkErrors]);
  
  // Check if this is a real artist (ID 26 or above)
  const isRealArtist = artist.id ? artist.id >= 26 : false;
  
  const getArtworkDetails = (artworkUrl: string, index: number): ArtworkDetails => {
    // Check if this is an assigned product
    const matchingProduct = assignedProducts?.find(p => p.image_url === artworkUrl);
    
    if (matchingProduct) {
      // This is an assigned product, use real product data
      return {
        image: artworkUrl,
        title: matchingProduct.name,
        description: matchingProduct.description || `${matchingProduct.name} from the 247 Art Store.`,
        specifications: {
          medium: matchingProduct.category,
          size: 'Available in Store',
          year: new Date().getFullYear().toString()
        },
        price: `$${matchingProduct.price.toFixed(2)}`
      };
    } else if (isRealArtist) {
      // For real artists (ID 26+), just show empty fields for traditional artworks
      return {
        image: artworkUrl,
        title: `${artist.name}'s Art`,
        description: `This is a temporary artwork preview for ${artist.name}.`,
        specifications: {
          medium: '',
          size: '',
          year: ''
        },
        price: "$"
      };
    } else {
      // For demo artists (ID below 26), show sample data for traditional artworks
      return {
        image: artworkUrl,
        title: `${artist.name}'s Art`,
        description: "This stunning piece showcases the artist's unique style and vision, bringing together elements of color, texture, and form in perfect harmony.",
        specifications: {
          medium: 'Acrylic on Canvas',
          size: '24" x 36"',
          year: `${new Date().getFullYear()}`
        },
        price: `$${Math.floor(Math.random() * 5000) + 1000}`
      };
    }
  };

  const handleArtworkClick = (artwork: string, index: number) => {
    setSelectedArtwork(getArtworkDetails(artwork, index));
    setIsModalOpen(true);
  };
  
  const handleAddToCart = () => {
    if (!selectedArtwork) return;
    
    // Check if this is an assigned product
    const matchingProduct = assignedProducts?.find(p => p.image_url === selectedArtwork.image);
    
    if (matchingProduct) {
      // This is an assigned product, add it to cart with real product data
      addItem({
        id: `product-${matchingProduct.id}`,
        name: matchingProduct.name,
        price: matchingProduct.price,
        image_url: matchingProduct.image_url || selectedArtwork.image,
        artist: { name: artist.name }
      });
    } else if (!isRealArtist) {
      // This is a demo artwork for demo artists
      const price = selectedArtwork.price ? parseFloat(selectedArtwork.price.replace('$', '')) : 1000;
      
      addItem({
        id: `${artist.id || 'artwork'}-${Date.now()}`,
        name: selectedArtwork.title,
        price: price,
        image_url: selectedArtwork.image,
        artist: { name: artist.name }
      });
    }
    
    // Close the modal after adding to cart
    setIsModalOpen(false);
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
                      handleArtworkImageError(e, index, artwork);
                      // Remove this artwork from validArtworks after error
                      setValidArtworks(current => current.filter(item => item !== artwork));
                    }}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className={`sm:max-w-md ${isMobile ? 'max-h-[90vh] p-3 overflow-hidden' : ''}`} 
          style={{ backgroundColor: panelColor }}
        >
          <DialogHeader className="pb-1">
            <DialogTitle>{selectedArtwork?.title}</DialogTitle>
            <DialogDescription className="line-clamp-2">
              {selectedArtwork?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className={`${isMobile ? 'flex flex-col overflow-y-auto max-h-[calc(90vh-8rem)]' : 'grid gap-4 py-4'}`}>
            <div className={`rounded-md overflow-hidden ${isMobile ? 'flex-shrink-0 mb-3' : 'mb-4'}`}>
              {selectedArtwork && (
                <div className="artwork-container">
                  <img 
                    src={selectedArtwork.image} 
                    alt={selectedArtwork.title}
                    className="w-full max-h-[50vh] object-contain rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className={`${isMobile ? 'flex-shrink-0' : ''} space-y-2`}>
              <h4 className="font-semibold text-sm">Specifications</h4>
              <p className="text-sm">
                Medium: {isRealArtist ? '' : selectedArtwork?.specifications.medium}<br />
                Size: {isRealArtist ? '' : selectedArtwork?.specifications.size}<br />
                Year: {isRealArtist ? '' : selectedArtwork?.specifications.year}
              </p>
            </div>
            
            {(() => {
              // Check if this is an assigned product
              const matchingProduct = assignedProducts?.find(p => p.image_url === selectedArtwork?.image);
              const isAssignedProduct = !!matchingProduct;
              const canAddToCart = isAssignedProduct || !isRealArtist;
              
              if (!canAddToCart) {
                return (
                  <div className={`${isMobile ? 'flex-shrink-0 mt-auto' : ''} space-y-4`}>
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800 font-medium">
                        This artwork is displayed for preview purposes only and is not currently available for purchase.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-lg">{selectedArtwork?.price}</span>
                      <Button 
                        disabled={true}
                        className="bg-gray-400 hover:bg-gray-400 text-white transition-colors rounded-lg cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className={`${isMobile ? 'flex-shrink-0 mt-auto' : ''} flex items-center justify-between mt-2`}>
                  <span className="font-bold text-lg">{selectedArtwork?.price}</span>
                  <Button 
                    onClick={handleAddToCart}
                    className="bg-[#ea384c] hover:bg-[#d41f33] text-white transition-colors rounded-lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAssignedProduct ? 'Add to Cart' : 'Add to Cart'}
                  </Button>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistProfileRightPanel;
