
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          <div className="w-full md:w-1/2 p-8">
            <div className="grid grid-cols-2 gap-4 aspect-square relative">
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
          <div className="w-full md:w-1/2 border-l border-border/40 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{product?.name}</h2>
                  <p className="text-muted-foreground">By {product?.artists?.name}</p>
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
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-muted-foreground">
                  {product?.description || "Discover this exclusive limited edition print, meticulously crafted to capture the essence of contemporary artistry. Each piece is individually numbered and personally signed by the artist, making it a unique addition to any collection."}
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="specifications">
                  <AccordionTrigger className="text-lg font-semibold">
                    Specifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Signed and numbered by the artist</li>
                      <li>• 310gsm 100% cotton-rag</li>
                      <li>• 200yr archival inks</li>
                      <li>• Embossed</li>
                      <li>• NFC chipped</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="production-shipping">
                  <AccordionTrigger className="text-lg font-semibold">
                    Production & Shipping
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm text-yellow-800">
                            Final edition count is determined on the conclusion of the countdown.
                          </p>
                          <p className="text-sm text-yellow-700">
                            As we need to run production and organize artist/s to sign. Expect arrival of your artwork up to 8 weeks. 
                            (Though, we'll do our best to make that happen waaay quicker!)
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button 
                className="w-full bg-zap-red hover:bg-zap-blue text-white"
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
