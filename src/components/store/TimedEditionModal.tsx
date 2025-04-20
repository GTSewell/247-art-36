import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductImageGallery from './ProductImageGallery';
import ProductHeader from './ProductHeader';
import ProductInfoAccordion from './ProductInfoAccordion';
import AddToCartButton from './AddToCartButton';
import { X } from 'lucide-react';
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

  // Determine if the timer has expired
  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
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
  if (!product) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 ${isMobile ? 'max-h-[90vh] w-[95vw]' : 'max-w-[1000px]'}`}>
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        
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
              <ProductHeader name={product.name} artistName={product.artists?.name} productId={product.id} timeLeft={timeLeft} />
              
              {isExpired && <div className="bg-black/90 text-white py-3 px-4 rounded-md flex items-center justify-center mt-3 mb-1">
                  <span className="text-lg font-medium tracking-wide uppercase">CLOSED</span>
                </div>}
              
              <ProductInfoAccordion description={product.description} openAccordions={openAccordions} onAccordionChange={handleAccordionChange} />
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100">
              <AddToCartButton isDisabled={isExpired} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default TimedEditionModal;