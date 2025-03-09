
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface FeaturedProductsProps {
  products: any[];
  onProductSelect: (product: any, timerState: TimerState) => void;
}

const getInitialTime = (index: number): TimerState => {
  switch (index) {
    case 0:
      return { hours: 0, minutes: 0, seconds: 33 };
    case 1:
      return { hours: 6, minutes: 0, seconds: 20 };
    case 2:
      return { hours: 12, minutes: 1, seconds: 10 };
    default:
      return { 
        hours: Math.floor(Math.random() * 24), 
        minutes: Math.floor(Math.random() * 60), 
        seconds: Math.floor(Math.random() * 60) 
      };
  }
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onProductSelect }) => {
  const [showControls, setShowControls] = useState(true);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (api && products.length > 0) {
      // Small delay to ensure carousel is fully rendered
      const timer = setTimeout(() => {
        // Scroll to the first item and center it
        api.scrollTo(0, { immediate: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [api, products.length]);

  const handleInteraction = () => {
    setShowControls(true);
    
    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    setInteractionTimeout(timeout);
  };

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <section className="mb-8">
      <div 
        className="relative" 
        onTouchStart={handleInteraction}
        onMouseMove={handleInteraction}
      >
        <Carousel 
          className="w-full" 
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            dragFree: false
          }}
        >
          <CarouselContent className="ml-0">
            {products.map((product, index) => {
              const initialTime = getInitialTime(index);
              return (
                <CarouselItem key={product.id} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative group overflow-hidden rounded-lg cursor-pointer h-64 md:h-72"
                    onClick={() => onProductSelect(product, initialTime)}
                  >
                    <div className="absolute top-1 right-1 z-10">
                      <CountdownTimer
                        initialHours={initialTime.hours}
                        initialMinutes={initialTime.minutes}
                        initialSeconds={initialTime.seconds}
                        productId={product.id}
                      />
                    </div>
                    <div className="h-full overflow-hidden">
                      <img 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        onError={handleImageError} 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-1 left-1 right-1">
                        <h3 className="text-white text-sm font-bold">{product.name}</h3>
                        <p className="text-white/90 text-xs">${product.price}</p>
                        <Button className="w-full mt-1 bg-zap-red hover:bg-zap-blue text-xs py-0.5" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <AnimatePresence>
            {(showControls || !isMobile) && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 left-2 top-1/2 -translate-y-1/2"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePrevious} 
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 right-2 top-1/2 -translate-y-1/2"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNext} 
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;
