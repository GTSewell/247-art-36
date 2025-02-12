
import React, { useState, useEffect } from 'react';
import { Gallery } from '@/data/types/gallery';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GalleryImagePanel from './GalleryImagePanel';
import GalleryDetailsPanel from './GalleryDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeaturedGalleriesProps {
  galleries: Gallery[];
  onSelect: (gallery: Gallery) => void;
  onFavoriteToggle: (galleryId: number, isFavorite: boolean) => void;
  favoriteGalleries: Set<number>;
}

const FeaturedGalleries: React.FC<FeaturedGalleriesProps> = ({
  galleries,
  onSelect,
  onFavoriteToggle,
  favoriteGalleries,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMobile]);

  const handleInteraction = () => {
    if (!isMobile) return;
    
    setShowControls(true);
    
    if (interactionTimeout) {
      clearTimeout(interactionTimeout);
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    setInteractionTimeout(timeout);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      api?.scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      api?.scrollNext();
    }
  };

  if (galleries.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative focus:outline-none w-full" 
      onTouchStart={handleInteraction}
      onMouseMove={handleInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Carousel 
        className="w-full mx-auto" 
        opts={{ 
          loop: true,
          duration: 50
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {galleries.map((gallery) => (
            <CarouselItem key={gallery.id}>
              <div className="px-4 py-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] max-w-5xl mx-auto"
                >
                  <GalleryImagePanel 
                    gallery={gallery}
                    onFavoriteToggle={onFavoriteToggle}
                    isFavorite={favoriteGalleries.has(gallery.id)}
                  />
                  <GalleryDetailsPanel 
                    gallery={gallery}
                    onSelect={() => onSelect(gallery)}
                  />
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <AnimatePresence>
          {(showControls || !isMobile) && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                onClick={() => api?.scrollPrev()}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                onClick={() => api?.scrollNext()}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </Carousel>
    </div>
  );
};

export default FeaturedGalleries;
