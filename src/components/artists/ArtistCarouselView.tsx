
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';

interface ArtistCarouselViewProps {
  artists: Artist[];
  selectedIndex: number;
  onClose: (e?: React.MouseEvent) => void;
  onSelect: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
}

const ArtistCarouselView: React.FC<ArtistCarouselViewProps> = ({
  artists,
  selectedIndex,
  onClose,
  onSelect,
  onFavoriteToggle,
  favoriteArtists,
}) => {
  const [api, setApi] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 2000);

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

  return (
    <div 
      className="relative focus:outline-none" 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleInteraction}
      onMouseMove={handleInteraction}
    >
      <Carousel 
        className="w-full max-w-full mx-auto" 
        opts={{ loop: true, startIndex: selectedIndex }}
        setApi={setApi}
      >
        <CarouselContent>
          {artists.map((artist) => (
            <CarouselItem key={artist.id}>
              <div className="container mx-auto px-4 py-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]"
                >
                  <ArtistImagePanel 
                    artist={artist}
                    onFavoriteToggle={onFavoriteToggle}
                    isFavorite={favoriteArtists.has(artist.id)}
                  />
                  <ArtistDetailsPanel 
                    artist={artist}
                    onSelect={() => onSelect(artist)}
                    onClose={onClose}
                  />
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <AnimatePresence>
          {showControls && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Carousel>
    </div>
  );
};

export default ArtistCarouselView;
