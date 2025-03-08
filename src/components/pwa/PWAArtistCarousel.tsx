
import React, { useState, useEffect } from 'react';
import { Artist } from '@/data/types/artist';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ArtistCard from '@/components/artists/ArtistCard';
import ArtistCarouselNavigation from '@/components/artists/ArtistCarouselNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  // Center the first artist when the carousel is initialized
  useEffect(() => {
    if (api && artists.length > 0) {
      // Small delay to ensure carousel is fully rendered
      const timer = setTimeout(() => {
        // Scroll to the first item and center it
        api.scrollTo(0, { immediate: true });
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
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center", // Change from "start" to "center"
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0"> {/* Remove default left margin */}
          {artists.map((artist) => (
            <CarouselItem key={artist.id} className="basis-2/3 sm:basis-1/2 md:basis-1/3 pl-4">
              <div className="h-150">
                <ArtistCard
                  id={artist.id}
                  name={artist.name}
                  specialty={artist.specialty}
                  image={artist.image}
                  city={artist.city}
                  country={artist.country}
                  bio={artist.bio}
                  techniques={artist.techniques}
                  styles={artist.styles}
                  social_platforms={artist.social_platforms}
                  onSelect={() => onSelect(artist)}
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
    </div>
  );
};

export default PWAArtistCarousel;
