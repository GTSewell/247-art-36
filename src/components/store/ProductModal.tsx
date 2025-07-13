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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 ${isMobile ? 'max-h-[90vh] w-[95vw]' : 'max-w-[1000px]'}`}>
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        
        {/* Navigation and Close buttons */}
        {showNavigation && (
          <>
            <button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous product"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 bg-neutral-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === products.length - 1}
              aria-label="Next product"
              className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 bg-neutral-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
        
        {/* Product counter */}
        {showNavigation && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm bg-neutral-300/90 z-50">
            <span className="text-xs text-gray-700 font-medium">
              {currentIndex + 1} of {products.length}
            </span>
          </div>
        )}
        
        {/* Close button with improved positioning */}
        <button onClick={onClose} aria-label="Close dialog" className="absolute right-1 top-1 p-1 rounded-full backdrop-blur-sm shadow-sm transition-colors z-50 px-[4px] text-center bg-neutral-300 hover:bg-neutral-200">
          <X className="h-4 w-4 text-gray-700" />
        </button>
        
        <div className={`${isMobile ? 'flex flex-col max-h-[90vh]' : 'flex flex-col md:flex-row max-h-[90vh]'}`}>
          <div className={`${isMobile ? 'w-full p-3' : 'w-full md:w-1/2 p-3 md:p-6'}`}>
            <ProductImageGallery images={variations} />
          </div>
          <div className={`${isMobile ? 'w-full border-t border-gray-100 p-3 overflow-y-auto' : 'w-full md:w-1/2 border-l border-gray-100 p-4 md:p-6 flex flex-col h-full overflow-y-auto'}`}>
            <div className="flex-grow space-y-3 md:space-y-4">
              <RegularProductHeader 
                name={product.name} 
                artistName={product.artists?.name} 
                price={product.price}
                isLimitedEdition={product.is_limited_edition}
              />
              
              <ProductInfoAccordion 
                description={product.description} 
                openAccordions={openAccordions} 
                onAccordionChange={handleAccordionChange} 
              />
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;