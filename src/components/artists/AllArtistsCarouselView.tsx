
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';

interface CarouselViewProps {
  artists: Artist[];
  selectedArtistIndex: number;
  onClose: (e?: React.MouseEvent) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  onSelect: (artist: Artist) => void;
  favoriteArtists: Set<number>;
}

const CarouselView: React.FC<CarouselViewProps> = ({
  artists,
  selectedArtistIndex,
  onClose,
  onFavoriteToggle,
  onSelect,
  favoriteArtists,
}) => {
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

  return (
    <div 
      className="relative"
      onTouchStart={handleInteraction}
      onMouseMove={handleInteraction}
    >
      <button 
        onClick={onClose}
        className="absolute right-6 top-6 z-10 bg-white/80 p-2 rounded-full hover:bg-white shadow-md backdrop-blur-sm"
      >
        <X className="h-4 w-4" />
      </button>
      <Carousel className="w-full max-w-full mx-auto" opts={{ loop: true, startIndex: selectedArtistIndex }}>
        <CarouselContent>
          {artists.map((artist) => (
            <CarouselItem key={artist.id}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-xl shadow-lg"
              >
                <ArtistImagePanel 
                  artist={artist}
                  onFavoriteToggle={onFavoriteToggle}
                  isFavorite={favoriteArtists.has(artist.id)}
                />
                <ArtistDetailsPanel 
                  artist={artist}
                  onSelect={() => onSelect(artist)}
                />
              </motion.div>
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Carousel>
    </div>
  );
};

export default CarouselView;
