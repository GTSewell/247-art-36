import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductImageGallery from './ProductImageGallery';
import RegularProductHeader from './RegularProductHeader';
import ProductInfoAccordion from './ProductInfoAccordion';
import AddToCartButton from './AddToCartButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  products?: any[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  products = [],
  currentIndex = 0,
  onNavigate
}) => {
  const variations = Array(4).fill(product?.image_url);
  const isMobile = useIsMobile();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  useEffect(() => {
    if (!isMobile) {
      setOpenAccordions(['details']);
    } else {
      setOpenAccordions([]);
    }
  }, [isMobile, isOpen]);

  const handleAccordionChange = (value: string) => {
    setOpenAccordions(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const handlePrevious = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (onNavigate && currentIndex < products.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const showNavigation = products.length > 1 && onNavigate;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isOpen || !showNavigation) return;
      
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (event.key === 'ArrowRight' && currentIndex < products.length - 1) {
        handleNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, currentIndex, products.length, showNavigation]);

  // Touch/swipe navigation for mobile
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
        if (deltaX > 0 && currentIndex < products.length - 1) {
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
  }, [isOpen, currentIndex, products.length, showNavigation, isMobile]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`relative p-0 overflow-visible bg-background rounded-xl shadow-lg border border-border ${isMobile ? 'max-h-[90vh] w-[95vw]' : 'max-w-[1000px]'}`}>
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        
        {/* Navigation buttons inside modal - desktop only */}
        {showNavigation && !isMobile && (
          <>
            <button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous product" 
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-50 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === products.length - 1}
              aria-label="Next product" 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-50 bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Product counter inside modal - desktop only */}
        {showNavigation && !isMobile && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur-md shadow-xl bg-background border-2 border-primary/20 z-50">
            <span className="text-xs text-foreground font-medium">
              {currentIndex + 1} of {products.length}
            </span>
          </div>
        )}
        
        <div className={`${isMobile ? 'flex flex-col max-h-[90vh]' : 'flex flex-col md:flex-row max-h-[90vh]'}`}>
          <div className={`${isMobile ? 'w-full p-3' : 'w-full md:w-1/2 p-3 md:p-6'}`}>
            <ProductImageGallery product={product} />
          </div>
          <div className={`${isMobile ? 'w-full border-t border-border p-3 overflow-y-auto' : 'w-full md:w-1/2 border-l border-border p-4 md:p-6 flex flex-col h-full overflow-y-auto'}`}>
            <div className="flex-grow space-y-3 md:space-y-4">
              <RegularProductHeader 
                name={product.name} 
                artistName={product.artists?.name} 
                price={product.price}
                isLimitedEdition={product.is_limited_edition}
                artistDomain={product.artists?.name ? product.artists.name.toLowerCase().replace(/\s+/g, '-') : undefined}
              />
              
              <ProductInfoAccordion 
                description={product.custom_description || product.description} 
                specifications={product.specifications}
                production_info={product.production_info}
                shipping_info={product.shipping_info}
                openAccordions={openAccordions} 
                onAccordionChange={handleAccordionChange} 
              />
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;