
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

  if (galleries.length === 0) return null;

  return (
    <div 
      className="relative focus:outline-none z-10" 
      onTouchStart={handleInteraction}
      onMouseMove={handleInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Carousel 
        className="w-full max-w-[1200px] mx-auto relative" 
        opts={{ 
          loop: true,
          duration: 50
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {galleries.map((gallery) => (
            <CarouselItem key={gallery.id} className="relative">
              <div className="container mx-auto px-4 py-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-xl shadow-[0_8px_20px_-5px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute z-20 ${
                  isMobile ? '-left-7 top-1/2 -translate-y-1/2' : 'left-4 top-1/2 -translate-y-1/2'
                }`}
              >
                <button onClick={() => api?.scrollPrev()} className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors">
                  <ChevronLeft className="h-6 w-6 text-gray-800" strokeWidth={2.5} />
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute z-20 ${
                  isMobile ? '-right-7 top-1/2 -translate-y-1/2' : 'right-4 top-1/2 -translate-y-1/2'
                }`}
              >
                <button onClick={() => api?.scrollNext()} className="p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors">
                  <ChevronRight className="h-6 w-6 text-gray-800" strokeWidth={2.5} />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Carousel>
    </div>
  );
};

export default FeaturedGalleries;
