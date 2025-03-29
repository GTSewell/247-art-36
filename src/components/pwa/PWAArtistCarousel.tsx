
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ArtistCard from '@/components/artists/ArtistCard';
import ArtistCarouselNavigation from '@/components/artists/ArtistCarouselNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import ArtistDetailModal from '@/components/artists/ArtistDetailModal';
import { logger } from '@/utils/logger';

// Helper function to ensure we have an array
const ensureArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch (e) {
    return [value];
  }
};

interface PWAArtistCarouselProps {
  artists: Artist[];
  onSelect: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtist: (artistId: number) => Promise<void | Artist>;
}

const PWAArtistCarousel: React.FC<PWAArtistCarouselProps> = ({
  artists,
  onSelect,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtist
}) => {
  const [api, setApi] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const isMobile = useIsMobile();

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    const index = artists.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    if (index >= 0 && index < artists.length) {
      setSelectedArtistIndex(index);
      setSelectedArtist(artists[index]);
    }
  };

  // Center the first artist when the carousel is initialized
  useEffect(() => {
    if (api && artists.length > 0) {
      // Small delay to ensure carousel is fully rendered
      const timer = setTimeout(() => {
        // Scroll to the first item and center it
        api.scrollTo(0, { immediate: true });
        logger.info("Artist carousel initialized and scrolled to first item");
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [api, artists.length]);

  if (!artists || artists.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg">No featured artists found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full artist-carousel">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          dragFree: true,
          containScroll: "trimSnaps",
          slidesToScroll: 1,
          // Improved touch settings for mobile
          dragThreshold: 10, // Lower threshold for easier dragging
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:ml-0">
          {artists.map((artist) => (
            <CarouselItem key={artist.id} className="basis-3/4 sm:basis-1/2 md:basis-1/3 pl-2 md:pl-4">
              <div className="h-auto">
                <ArtistCard
                  id={artist.id}
                  name={artist.name}
                  specialty={artist.specialty}
                  image={artist.image}
                  city={artist.city}
                  country={artist.country}
                  bio={artist.bio}
                  techniques={ensureArray(artist.techniques)}
                  styles={ensureArray(artist.styles)}
                  social_platforms={ensureArray(artist.social_platforms)}
                  onSelect={(e) => handleArtistClick(e, artist)}
                  onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
                  isFavorite={favoriteArtists.has(artist.id)}
                  refreshArtist={refreshArtist}
                  showNameOverlay={true}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <ArtistCarouselNavigation 
          isMobile={isMobile} 
          onPrevious={handlePrevious} 
          onNext={handleNext} 
        />
      </Carousel>

      {/* Artist Detail Modal */}
      <ArtistDetailModal
        artists={artists}
        selectedArtist={selectedArtist}
        selectedArtistIndex={selectedArtistIndex}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onArtistChange={handleArtistChange}
        onFavoriteToggle={onFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtists={() => {}}
        onSelect={onSelect}
      />
    </div>
  );
};

export default PWAArtistCarousel;
