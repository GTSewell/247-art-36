import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { Artist } from '@/data/types/artist';
import { AssignedProduct } from '@/hooks/useAssignedProducts';
import { ArtworkDetails } from '../types/ArtworkTypes';

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArtwork: ArtworkDetails | null;
  panelColor: string;
  artist: Artist;
  assignedProducts?: AssignedProduct[];
  onAddToCart: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  isOpen,
  onClose,
  selectedArtwork,
  panelColor,
  artist,
  assignedProducts,
  onAddToCart
}) => {
  const isMobile = useIsMobile();
  const isRealArtist = artist.id ? artist.id >= 26 : false;
  
  const matchingProduct = assignedProducts?.find(p => p.image_url === selectedArtwork?.image);
  const isAssignedProduct = !!matchingProduct;
  const canAddToCart = isAssignedProduct || !isRealArtist;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          
          {!canAddToCart ? (
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
          ) : (
            <div className={`${isMobile ? 'flex-shrink-0 mt-auto' : ''} flex items-center justify-between mt-2`}>
              <span className="font-bold text-lg">{selectedArtwork?.price}</span>
              <Button 
                onClick={onAddToCart}
                className="bg-[#ea384c] hover:bg-[#d41f33] text-white transition-colors rounded-lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkModal;