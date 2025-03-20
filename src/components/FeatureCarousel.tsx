
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Features data with images and titles
const features = [
  {
    id: 1,
    title: "ARTIST DASHBOARD",
    image: "/lovable-uploads/8b44119e-1093-4da5-b7fd-6c5305c09619.png"
  },
  {
    id: 2,
    title: "WORLD CLASS EXHIBITION SPACE",
    image: "/lovable-uploads/f26e3342-6c75-498e-a721-718b1f325317.png"
  },
  {
    id: 3,
    title: "LINK IN BIO: ARTIST PROFILE",
    image: "/lovable-uploads/d064ad8b-d6c3-4764-baa6-1584d0edb7dd.png"
  },
  {
    id: 4,
    title: "FINE ART PRINT HOUSE",
    image: "/lovable-uploads/854ba3fb-7655-43ac-adb4-3e6a17e79570.png"
  },
  {
    id: 5,
    title: "GALLERY COMMISSION: 25% TO 0%!",
    image: "/lovable-uploads/f6fad20e-2721-4fdc-9fb7-94f1496ca71d.png"
  },
  {
    id: 6,
    title: "STP: STICKERS | T-SHIRT | PRINT",
    image: "/lovable-uploads/3abf23ac-9b8e-40c7-9a91-d2dc1793aaed.png"
  }
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="w-full bg-black py-8 overflow-hidden">
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {features.map((feature) => (
            <CarouselItem key={feature.id} className="basis-full md:basis-full lg:basis-full p-0">
              <div className="relative">
                {/* Title overlay at the top */}
                <div className="absolute top-0 left-0 w-full z-10 bg-black bg-opacity-70 p-3">
                  <h2 className="text-2xl md:text-4xl text-white font-bold text-center">
                    {feature.title}
                  </h2>
                </div>
                {/* Feature image */}
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20">
          <CarouselPrevious 
            className="bg-white/20 hover:bg-white/50 border-none text-white"
          />
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
          <CarouselNext 
            className="bg-white/20 hover:bg-white/50 border-none text-white"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default FeatureCarousel;
