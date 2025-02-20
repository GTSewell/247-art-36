
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
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
    }, 5000);

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
    }, 5000);

    setInteractionTimeout(timeout);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2 flex-nowrap min-w-0">
        <img 
          src="/lovable-uploads/3ab59a55-2f79-43d8-970b-05c9af0af079.png" 
          alt="Dynamite"
          className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
        />
        <img 
          src="/lovable-uploads/1ad216c5-788d-45eb-898a-f6600cee2e79.png" 
          alt="Timed Edition Drops"
          className="h-12 md:h-16 w-auto object-contain"
        />
        <img 
          src="/lovable-uploads/3ab59a55-2f79-43d8-970b-05c9af0af079.png" 
          alt="Dynamite"
          className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0 scale-x-[-1]"
        />
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
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4">
            <div className={`transition-opacity duration-300 pointer-events-auto ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => api?.scrollPrev()} 
                className="relative h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              >
                <div className="absolute inset-0 rounded-full bg-zap-blue/50 animate-ping" />
                <ArrowBigLeft className="w-6 h-6 text-white relative z-10" />
              </Button>
            </div>
            <div className={`transition-opacity duration-300 pointer-events-auto ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => api?.scrollNext()} 
                className="relative h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              >
                <div className="absolute inset-0 rounded-full bg-zap-blue/50 animate-ping" />
                <ArrowBigRight className="w-6 h-6 text-white relative z-10" />
              </Button>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;
