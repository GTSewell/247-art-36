import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductImageGallery from './ProductImageGallery';
import RegularProductHeader from './RegularProductHeader';
import ProductInfoAccordion from './ProductInfoAccordion';
import AddToCartButton from './AddToCartButton';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const handlePrevious = () => {
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
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

  if (!product) return null;

  return (
    <div className="relative">
      {/* Navigation buttons outside modal - desktop only */}
      {showNavigation && !isMobile && (
        <>
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous product"
            className="fixed left-[calc(50vw-515px)] top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-[100] bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === products.length - 1}
            aria-label="Next product"
            className="fixed right-[calc(50vw-515px)] top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md shadow-xl transition-all duration-200 z-[100] bg-background border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Product counter outside modal - desktop only */}
      {showNavigation && !isMobile && (
        <div className="fixed top-[calc(50vh-45vh-45px)] left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md shadow-xl bg-background border-2 border-primary/20 z-[100]">
          <span className="text-sm text-foreground font-medium">
            {currentIndex + 1} of {products.length}
          </span>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`p-0 overflow-hidden bg-background rounded-xl shadow-lg border border-border ${isMobile ? 'max-h-[90vh] w-[95vw]' : 'max-w-[1000px]'}`}>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
          
          {/* Close button */}
          <button onClick={onClose} aria-label="Close dialog" className="absolute right-2 top-2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 bg-background/90 hover:bg-muted border border-border">
            <X className="h-4 w-4 text-foreground" />
          </button>
          
          <div className={`${isMobile ? 'flex flex-col max-h-[90vh]' : 'flex flex-col md:flex-row max-h-[90vh]'}`}>
            <div className={`${isMobile ? 'w-full p-3' : 'w-full md:w-1/2 p-3 md:p-6'}`}>
              <ProductImageGallery images={variations} />
            </div>
            <div className={`${isMobile ? 'w-full border-t border-border p-3 overflow-y-auto' : 'w-full md:w-1/2 border-l border-border p-4 md:p-6 flex flex-col h-full overflow-y-auto'}`}>
              <div className="flex-grow space-y-3 md:space-y-4">
                <RegularProductHeader 
                  name={product.name} 
                  artistName={product.artists?.name} 
                  price={product.price}
                  isLimitedEdition={product.is_limited_edition}
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
    </div>
  );
};

export default ProductModal;