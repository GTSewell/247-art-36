
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductImageGallery from './ProductImageGallery';
import ProductHeader from './ProductHeader';
import ProductInfoAccordion from './ProductInfoAccordion';
import AddToCartButton from './AddToCartButton';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimedEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  timeLeft: TimerState;
}

const TimedEditionModal: React.FC<TimedEditionModalProps> = ({
  isOpen,
  onClose,
  product,
  timeLeft
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
    setOpenAccordions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          <div className="w-full md:w-1/2 p-3 md:p-8">
            <ProductImageGallery images={variations} />
          </div>
          <div className="w-full md:w-1/2 border-l border-border/40 p-2 md:p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex-grow space-y-2 md:space-y-4">
              <ProductHeader 
                name={product.name} 
                artistName={product.artists?.name} 
                productId={product.id}
                timeLeft={timeLeft}
              />
              
              <ProductInfoAccordion 
                description={product.description}
                openAccordions={openAccordions}
                onAccordionChange={handleAccordionChange}
              />
            </div>
            
            <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-border/40 sticky bottom-0 bg-white/95">
              <AddToCartButton />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimedEditionModal;
