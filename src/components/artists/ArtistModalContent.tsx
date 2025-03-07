
import React from "react";
import { Artist } from "@/data/types/artist";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import ArtistDetailItem from "./ArtistDetailItem";
import ArtistCarouselNavigation from "./ArtistCarouselNavigation";
import { useArtistCarousel } from "./hooks/useArtistCarousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface ArtistModalContentProps {
  artists: Artist[];
  selectedArtistIndex: number;
  onArtistChange: (index: number) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistModalContent: React.FC<ArtistModalContentProps> = ({
  artists,
  selectedArtistIndex,
  onArtistChange,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  onSelect
}) => {
  const isMobile = useIsMobile();
  const { carouselApi, setCarouselApi, processArtist } = useArtistCarousel({
    artists,
    selectedArtistIndex,
    onArtistChange
  });

  return (
    <Carousel 
      className="w-full" 
      opts={{ 
        align: "start",
        containScroll: false,
        startIndex: selectedArtistIndex
      }}
      setApi={setCarouselApi}
    >
      <CarouselContent className="-ml-0 sm:-ml-2">
        {artists.map((artist, index) => {
          // Pre-process artist to ensure max 4 artworks
          const processedArtist = processArtist(artist);
          
          return (
            <ArtistDetailItem
              key={artist.id}
              artist={artist}
              processedArtist={processedArtist}
              onFavoriteToggle={onFavoriteToggle}
              isFavorite={favoriteArtists.has(artist.id)}
              refreshArtists={refreshArtists}
              onSelect={onSelect}
            />
          );
        })}
      </CarouselContent>
      <ArtistCarouselNavigation isMobile={isMobile} />
    </Carousel>
  );
};

export default ArtistModalContent;
