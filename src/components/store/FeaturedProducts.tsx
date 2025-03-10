
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductItem from "./ProductItem";
import CarouselNavigation from "./CarouselNavigation";
import { useAppMode } from '@/contexts/AppModeContext';

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
  const { isPWA } = useAppMode();

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

  return (
    <section className="mb-8 w-full">
      <div 
        className="relative w-full" 
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
          <CarouselContent className={`ml-0 ${isPWA ? 'pl-0' : ''}`}>
            {products.map((product, index) => {
              const initialTime = getInitialTime(index);
              return (
                <CarouselItem key={product.id} className={`basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${isPWA ? 'pl-2 pr-2' : 'pl-4'}`}>
                  <ProductItem 
                    product={product} 
                    initialTime={initialTime}
                    onSelect={onProductSelect}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <CarouselNavigation 
            showControls={showControls}
            isMobile={isMobile}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;
