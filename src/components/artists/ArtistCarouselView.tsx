import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from '@/components/ui/carousel';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return; // Only auto-hide on mobile
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMobile]);

  const handleInteraction = () => {
    if (!isMobile) return; // Only handle interactions on mobile
    
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
        opts={{ 
          loop: true, 
          startIndex: selectedIndex,
          duration: 50
        }}
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
                  <div className="relative">
                    <ArtistImagePanel 
                      artist={artist}
                      onFavoriteToggle={onFavoriteToggle}
                      isFavorite={favoriteArtists.has(artist.id)}
                    />
                    {isMobile && (
                      <button 
                        onClick={onClose}
                        className="absolute -right-2 top-2 z-10 bg-white/80 p-2 rounded-full hover:bg-white shadow-md backdrop-blur-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ea384c]"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                  </div>
                  <ArtistDetailsPanel 
                    artist={artist}
                    onSelect={() => onSelect(artist)}
                    onClose={!isMobile ? onClose : undefined}
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
                className={`absolute ${
                  isMobile ? '-left-7 top-1/2 -translate-y-1/2' : 'left-0 md:-left-4 top-1/2 -translate-y-1/2'
                }`}
              >
                <button onClick={() => api?.scrollPrev()} className="p-2">
                  <ChevronLeft className="h-6 w-6 text-gray-800" strokeWidth={2.5} />
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${
                  isMobile ? '-right-7 top-1/2 -translate-y-1/2' : 'right-0 md:-right-4 top-1/2 -translate-y-1/2'
                }`}
              >
                <button onClick={() => api?.scrollNext()} className="p-2">
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

export default ArtistCarouselView;
