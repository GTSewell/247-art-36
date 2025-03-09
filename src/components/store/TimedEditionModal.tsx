
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  useEffect(() => {
    if (!isMobile) {
      setOpenAccordions(['details']);
    } else {
      setOpenAccordions([]);
    }
  }, [isMobile, isOpen]);

  const handleAddToCart = () => {
    toast.success("Added to cart!", {
      description: "This item has been added to your cart."
    });
  };

  const handleImageClick = (index: number) => {
    if (selectedImage === index) {
      setSelectedImage(null);
    } else {
      setSelectedImage(index);
    }
  };

  const handleAccordionChange = (value: string) => {
    setOpenAccordions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          <div className="w-full md:w-1/2 p-4 md:p-8">
            <div className="grid grid-cols-2 gap-2 md:gap-4 aspect-square relative">
              <AnimatePresence>
                {selectedImage !== null ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10"
                    onClick={() => handleImageClick(selectedImage)}
                  >
                    <div className="relative aspect-square rounded overflow-hidden cursor-pointer">
                      <img
                        src={variations[selectedImage]}
                        alt={`Enlarged variation ${selectedImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                ) : (
                  variations.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative aspect-square rounded overflow-hidden cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="w-full md:w-1/2 border-l border-border/40 p-3 md:p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex-grow space-y-2 md:space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">{product?.name}</h2>
                  <p className="text-sm md:text-base text-muted-foreground">By {product?.artists?.name}</p>
                </div>
                {timeLeft && product && (
                  <CountdownTimer 
                    initialHours={timeLeft.hours}
                    initialMinutes={timeLeft.minutes}
                    initialSeconds={timeLeft.seconds}
                    productId={product.id}
                  />
                )}
              </div>
              
              <Accordion 
                type="multiple" 
                value={openAccordions} 
                onValueChange={setOpenAccordions} 
                className="w-full"
              >
                <AccordionItem value="details" className="border-b-0 md:border-b">
                  <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-4">
                    Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {product?.description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="specifications" className="border-b-0 md:border-b">
                  <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-4">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                      <li>• Signed and numbered by the artist</li>
                      <li>• 310gsm 100% cotton-rag</li>
                      <li>• 200yr archival inks</li>
                      <li>• Embossed</li>
                      <li>• NFC chipped</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="production-shipping" className="border-b-0 md:border-b">
                  <AccordionTrigger className="text-base md:text-lg font-semibold py-2 md:py-4">
                    Production & Shipping
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-yellow-50 p-2 md:p-4 rounded-lg">
                      <div className="flex items-start gap-2 md:gap-3">
                        <Info className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5" />
                        <div className="space-y-1 md:space-y-2">
                          <p className="text-xs md:text-sm text-yellow-800">
                            Final edition count is determined on the conclusion of the countdown.
                          </p>
                          <p className="text-xs md:text-sm text-yellow-700">
                            As we need to run production and organize artist/s to sign. Expect arrival of your artwork up to 8 weeks. 
                            (Though, we'll do our best to make that happen waaay quicker!)
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-border/40 sticky bottom-0">
              <Button 
                className="w-full bg-zap-red hover:bg-zap-blue text-white py-3"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimedEditionModal;
