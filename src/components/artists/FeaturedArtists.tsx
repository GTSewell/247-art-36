
import React from 'react';
import { Artist } from '@/data/types/artist';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {artists.map((artist) => (
            <CarouselItem key={artist.id}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl shadow-lg"
              >
                {/* Left side - Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute bottom-4 right-4 z-10 ${
                      favoriteArtists.has(artist.id)
                        ? 'bg-zap-yellow text-black hover:bg-zap-yellow/90'
                        : 'bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteToggle(artist.id, !favoriteArtists.has(artist.id));
                    }}
                  >
                    <Zap size={24} />
                  </Button>
                </div>

                {/* Right side - Artist Info */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Palette size={20} />
                        <span>{artist.specialty}</span>
                      </div>
                      {artist.city && artist.country && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={20} />
                          <span>{`${artist.city}, ${artist.country}`}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed">{artist.bio}</p>

                    {/* Styles */}
                    {artist.styles && artist.styles.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Styles</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.styles.map((style) => (
                            <span
                              key={style}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => onSelect(artist)}
                      className="w-full"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
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
