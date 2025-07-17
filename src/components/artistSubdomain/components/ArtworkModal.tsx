import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductImageGallery from '@/components/store/ProductImageGallery';
import RegularProductHeader from '@/components/store/RegularProductHeader';
import ProductInfoAccordion from '@/components/store/ProductInfoAccordion';
import AddToCartButton from '@/components/store/AddToCartButton';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  artworks?: string[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
  isOpen,
  onClose,
  selectedArtwork,
  panelColor,
  artist,
  assignedProducts,
  onAddToCart,
  artworks = [],
  currentIndex = 0,
  onNavigate
}) => {
  const isMobile = useIsMobile();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  
  const isRealArtist = artist.id ? artist.id >= 26 : false;
  const matchingProduct = assignedProducts?.find(p => p.image_url === selectedArtwork?.image);
  const isAssignedProduct = !!matchingProduct;
  const canAddToCart = isAssignedProduct || !isRealArtist;

  useEffect(() => {
    if (!isMobile) {
      setOpenAccordions(['details']);
    } else {
      setOpenAccordions([]);
    }
  }, [isMobile, isOpen]);

  const handlePrevious = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (onNavigate && currentIndex < artworks.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const showNavigation = artworks.length > 1 && onNavigate;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !showNavigation) return;
      
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight' && currentIndex < artworks.length - 1) {
        event.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, artworks.length, showNavigation]);

  // Handle touch events for swipe navigation
  useEffect(() => {
    if (!isOpen || !showNavigation || !isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = Math.abs(touchStartY - touchEndY);
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0 && currentIndex < artworks.length - 1) {
          handleNext();
        } else if (deltaX < 0 && currentIndex > 0) {
          handlePrevious();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, currentIndex, artworks.length, showNavigation, isMobile]);

  const handleAccordionChange = (value: string) => {
    setOpenAccordions(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  if (!selectedArtwork) return null;

  // Create artwork images array (for now just the single image, but could be expanded)
  const artworkImages = [selectedArtwork.image];

  // Convert artwork data to product-like structure for components
  const artworkAsProduct = {
    id: selectedArtwork.image, // Use image as unique ID
    name: selectedArtwork.title,
    price: parseFloat(selectedArtwork.price?.replace('$', '') || '0'),
    image_url: selectedArtwork.image,
    artists: { name: artist.name },
    is_limited_edition: false,
    custom_description: selectedArtwork.description,
    specifications: matchingProduct?.specifications || selectedArtwork.specifications
  };

  // Use product specifications if available, otherwise fallback to artwork specs
  const specifications = matchingProduct?.specifications || {
    'Medium': selectedArtwork.specifications.medium || 'N/A',
    'Size': selectedArtwork.specifications.size || 'N/A', 
    'Year': selectedArtwork.specifications.year || 'N/A'
  };

  return (
    <div className="relative">
      {/* Navigation buttons outside modal - desktop only */}
      {isOpen && showNavigation && !isMobile && (
        <>
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous artwork" 
            className="fixed left-[calc(50vw-525px)] top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-[10001] bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === artworks.length - 1}
            aria-label="Next artwork" 
            className="fixed right-[calc(50vw-525px)] top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-[10001] bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Artwork counter outside modal - desktop only */}
      {isOpen && showNavigation && !isMobile && (
        <div className="fixed top-[calc(50vh-45vh)] left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md shadow-xl bg-background border-2 border-primary/20 z-[10001]">
          <span className="text-sm text-foreground font-medium">
            {(currentIndex || 0) + 1} of {artworks.length}
          </span>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`p-0 overflow-hidden bg-background rounded-xl shadow-lg border border-border ${isMobile ? 'max-h-[90vh] w-[95vw]' : 'max-w-[1000px]'}`}>
          <DialogTitle className="sr-only">Artwork Details</DialogTitle>
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            aria-label="Close dialog" 
            className="absolute right-2 top-2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 bg-background/90 hover:bg-muted border border-border"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>
          
          <div className={`${isMobile ? 'flex flex-col max-h-[90vh]' : 'flex flex-col md:flex-row max-h-[90vh]'}`}>
            <div className={`${isMobile ? 'w-full p-3' : 'w-full md:w-1/2 p-3 md:p-6'}`}>
              <ProductImageGallery images={artworkImages} />
            </div>
            <div className={`${isMobile ? 'w-full border-t border-border p-3 overflow-y-auto' : 'w-full md:w-1/2 border-l border-border p-4 md:p-6 flex flex-col h-full overflow-y-auto'}`}>
              <div className="flex-grow space-y-3 md:space-y-4">
                <RegularProductHeader 
                  name={selectedArtwork.title} 
                  artistName={artist.name} 
                  price={parseFloat(selectedArtwork.price?.replace('$', '') || '0')}
                  isLimitedEdition={false}
                  artistDomain={artist.name ? artist.name.toLowerCase().replace(/\s+/g, '-') : undefined}
                />
                
                <ProductInfoAccordion 
                  description={selectedArtwork.description} 
                  specifications={specifications}
                  production_info={isRealArtist ? undefined : "This artwork is displayed for preview purposes only and is not currently available for purchase."}
                  shipping_info={canAddToCart ? undefined : "Not available for shipping"}
                  openAccordions={openAccordions} 
                  onAccordionChange={handleAccordionChange} 
                />
              </div>
              
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
                {canAddToCart ? (
                  <AddToCartButton product={artworkAsProduct} />
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800 font-medium">
                        This artwork is displayed for preview purposes only and is not currently available for purchase.
                      </p>
                    </div>
                    <AddToCartButton product={artworkAsProduct} isDisabled={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtworkModal;