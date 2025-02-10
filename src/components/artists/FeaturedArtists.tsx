
import React from 'react';
import { Artist } from '@/data/types/artist';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';
import ArtistImagePanel from './ArtistImagePanel';
import ArtistDetailsPanel from './ArtistDetailsPanel';

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
  if (artists.length === 0) return null;

  return (
    <div className="mb-12 relative">
      <Carousel className="w-full max-w-full mx-auto" opts={{ loop: true }}>
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
                  onSelect={onSelect}
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm" />
      </Carousel>
    </div>
  );
};

export default FeaturedArtists;
