
import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
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
        <div className="relative">
          <button 
            onClick={closeCarousel}
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
                      onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect(artist);
                      }}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md backdrop-blur-sm" />
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
                  onSelect(artist);
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
