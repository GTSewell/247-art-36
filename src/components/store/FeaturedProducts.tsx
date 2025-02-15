
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Hourglass } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface TimerState {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

interface FeaturedProductsProps {
  products: any[];
  onProductSelect: (product: any, timerState: TimerState) => void;
}

const getInitialTime = (index: number): TimerState => {
  switch (index) {
    case 0:
      return { initialHours: 0, initialMinutes: 0, initialSeconds: 33 };
    case 1:
      return { initialHours: 6, initialMinutes: 0, initialSeconds: 20 };
    case 2:
      return { initialHours: 12, initialMinutes: 1, initialSeconds: 10 };
    default:
      return { 
        initialHours: Math.floor(Math.random() * 24), 
        initialMinutes: Math.floor(Math.random() * 60), 
        initialSeconds: Math.floor(Math.random() * 60) 
      };
  }
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onProductSelect }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Hourglass className="text-zap-yellow" />
        Timed Edition Drops
      </h2>
      <Carousel className="relative">
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
                      initialHours={initialTime.initialHours}
                      initialMinutes={initialTime.initialMinutes}
                      initialSeconds={initialTime.initialSeconds}
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default FeaturedProducts;
