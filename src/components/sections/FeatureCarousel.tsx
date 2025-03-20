
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import CarouselNavigation from "@/components/store/CarouselNavigation";

// Feature card data structure
interface FeatureCardProps {
  title: string;
  image: string;
  alt: string;
}

// Individual feature card component
const FeatureCard: React.FC<FeatureCardProps> = ({ title, image, alt }) => {
  return (
    <div className="flex flex-col">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img src={image} alt={alt} className="w-full h-auto object-cover" />
      </div>
      <h3 className="text-center font-extrabold text-gray-800 text-xl md:text-2xl mt-3 uppercase">{title}</h3>
    </div>
  );
};

const FeatureCarousel: React.FC = () => {
  const [showControls, setShowControls] = useState(true);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

  // Features data
  const features = [
    {
      title: "ARTIST DASHBOARD",
      image: "/lovable-uploads/c8f12e4b-14a4-4a45-9afb-6ecebd1a96bf.png",
      alt: "Artist dashboard interface showing analytics and collector information"
    },
    {
      title: "GALLERY COMMISSION: 25% TO 0%!",
      image: "/lovable-uploads/37c40384-13a3-46b4-a78b-1838f83704d5.png",
      alt: "Gallery showing featured artists with zero commission"
    },
    {
      title: "LINK IN BIO: ARTIST PROFILE",
      image: "/lovable-uploads/81a1baff-1653-4af0-96da-6514d80b885e.png",
      alt: "Artist profile page with bio and featured artworks"
    },
    {
      title: "FINE ART PRINT HOUSE",
      image: "/lovable-uploads/57dd40e3-af87-4f61-9da1-6726ed638d4f.png",
      alt: "People at a fine art print house with artwork"
    },
    {
      title: "WORLD CLASS EXHIBITION SPACE",
      image: "/lovable-uploads/4065a6d7-bcce-4b63-afdd-7cf915ff507f.png",
      alt: "Exhibition space with many visitors viewing art on walls"
    },
    {
      title: "STP: STICKERS | T-SHIRT | PRINT",
      image: "/lovable-uploads/ebe78868-0137-4715-b850-f18ef6be3a8a.png",
      alt: "Merchandise featuring stickers, t-shirt and prints"
    }
  ];

  React.useEffect(() => {
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

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full py-8 md:py-12 mt-24 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative w-full" 
          onTouchStart={handleInteraction}
          onMouseMove={handleInteraction}
        >
          <Carousel 
            className="w-full" 
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: false,
            }}
          >
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <FeatureCard
                    title={feature.title}
                    image={feature.image}
                    alt={feature.alt}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselNavigation 
              showControls={showControls}
              isMobile={isMobile}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </Carousel>
        </div>
      </div>
    </motion.section>
  );
};

export default FeatureCarousel;
