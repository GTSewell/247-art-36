
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Hourglass, ChevronLeft, ChevronRight } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useIsMobile } from "@/hooks/use-mobile";

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
    }, 5000); // Extended to 5 seconds

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleInteraction = () => {
    setShowControls(true);
    
    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 5000); // Extended to 5 seconds

    setInteractionTimeout(timeout);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Hourglass className="text-zap-yellow" />
        Timed Edition Drops
      </h2>
      <div 
        className="relative" 
        onTouchStart={handleInteraction}
        onMouseMove={handleInteraction}
      >
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {products.map((product, index) => {
              const initialTime = getInitialTime(index);
              return (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div 
                    className="relative group overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => onProductSelect(product, initialTime)}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <CountdownTimer
                        initialHours={initialTime.hours}
                        initialMinutes={initialTime.minutes}
                        initialSeconds={initialTime.seconds}
                        productId={product.id}
                      />
                    </div>
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        onError={handleImageError} 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg font-bold mb-1">{product.name}</h3>
                        <p className="text-white/90">${product.price}</p>
                        <Button className="w-full mt-2 bg-zap-red hover:bg-zap-blue">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-2">
            <div className={`transition-opacity duration-300 pointer-events-auto ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => api?.scrollPrev()} 
                className="h-12 w-12 rounded-full hover:bg-transparent"
              >
                <ChevronLeft className="h-8 w-8 text-zap-yellow animate-pulse" />
              </Button>
            </div>
            <div className={`transition-opacity duration-300 pointer-events-auto ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => api?.scrollNext()} 
                className="h-12 w-12 rounded-full hover:bg-transparent"
              >
                <ChevronRight className="h-8 w-8 text-zap-yellow animate-pulse" />
              </Button>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;
