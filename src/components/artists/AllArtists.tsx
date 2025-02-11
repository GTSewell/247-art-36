import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistCard from './ArtistCard';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';

interface AllArtistsProps {
  artists: Artist[];
  allArtistsSearch: string;
  setAllArtistsSearch: (search: string) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  onSelect: (artist: Artist) => void;
  onRegenerateImage: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
}

const AllArtists: React.FC<AllArtistsProps> = ({
  artists,
  allArtistsSearch,
  setAllArtistsSearch,
  showFavorites,
  setShowFavorites,
  onSelect,
  onRegenerateImage,
  onFavoriteToggle,
  favoriteArtists,
}) => {
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null);
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

  const handleArtistClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArtistIndex(index);
  };

  const closeCarousel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedArtistIndex(null);
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
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">All Artists</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-border">
            <Checkbox
              id="showFavorites"
              checked={showFavorites}
              onCheckedChange={(checked) => setShowFavorites(checked as boolean)}
              className="data-[state=checked]:bg-zap-yellow data-[state=checked]:text-black"
            />
            <label
              htmlFor="showFavorites"
              className="text-sm font-medium leading-none cursor-pointer select-none"
            >
              View Favorite Artists
            </label>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search artists..."
              value={allArtistsSearch}
              onChange={(e) => setAllArtistsSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {selectedArtistIndex !== null ? (
        <div 
          className="relative focus:outline-none" 
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleInteraction}
          onMouseMove={handleInteraction}
        >
          <button 
            onClick={closeCarousel}
            className="absolute left-6 top-0 z-10 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md backdrop-blur-sm"
          >
            <X className="h-4 w-4 text-[#ea384c]" />
          </button>
          <Carousel 
            className="w-full max-w-full mx-auto" 
            opts={{ loop: true, startIndex: selectedArtistIndex }}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist, index) => (
            <div 
              key={artist.id} 
              onClick={(e) => handleArtistClick(index, e)}
              className="cursor-pointer"
            >
              <ArtistCard
                {...artist}
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleArtistClick(index, e);
                }}
                onRegenerateImage={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRegenerateImage(artist);
                }}
                onFavoriteToggle={(isFavorite) => {
                  onFavoriteToggle(artist.id, isFavorite);
                }}
                isFavorite={favoriteArtists.has(artist.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllArtists;
