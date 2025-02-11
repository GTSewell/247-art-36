
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeaturedArtistsProps {
  artists: Artist[];
  onSelect: (artist: Artist) => void;
  onRegenerateImage: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
}

const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({
  artists,
  onSelect,
  onRegenerateImage,
  onFavoriteToggle,
  favoriteArtists,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

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

  if (artists.length === 0) return null;

  return (
    <div 
      className="mb-12 relative focus:outline-none" 
      onTouchStart={handleInteraction}
      onMouseMove={handleInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Carousel 
        className="w-full max-w-full mx-auto" 
        opts={{ loop: true }}
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-xl shadow-[0_8px_20px_-5px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
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
                <CarouselPrevious className={`absolute left-0 md:left-4 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70 ${
                  isMobile ? 'top-[calc(50%-41px)]' : 'top-1/2 -translate-y-1/2'
                }`} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CarouselNext className={`absolute right-0 md:right-4 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm md:opacity-100 opacity-70 ${
                  isMobile ? 'top-[calc(50%-41px)]' : 'top-1/2 -translate-y-1/2'
                }`} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Carousel>
    </div>
  );
};

export default FeaturedArtists;

