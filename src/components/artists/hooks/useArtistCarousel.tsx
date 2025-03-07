
import React from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { Artist } from "@/data/types/artist";
import { logger } from "@/utils/logger";

interface UseArtistCarouselProps {
  artists: Artist[];
  selectedArtistIndex: number;
  onArtistChange: (index: number) => void;
}

export const useArtistCarousel = ({
  artists,
  selectedArtistIndex,
  onArtistChange
}: UseArtistCarouselProps) => {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null);

  // Effect to handle carousel changes
  React.useEffect(() => {
    if (!carouselApi) return;

    carouselApi.scrollTo(selectedArtistIndex);
    
    const onSelect = () => {
      const currentIndex = carouselApi.selectedScrollSnap();
      onArtistChange(currentIndex);
    };

    carouselApi.on("select", onSelect);
    
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, selectedArtistIndex, artists, onArtistChange]);

  // Process artist to ensure maximum of 4 artworks
  const processArtist = (artist: Artist): Artist => {
    if (!artist.artworks) return artist;
    
    const processed = {...artist};
    
    // Process artworks to ensure maximum of 4
    if (typeof processed.artworks === 'string') {
      try {
        const parsed = JSON.parse(processed.artworks);
        processed.artworks = Array.isArray(parsed) ? parsed.slice(0, 4) : [];
      } catch {
        processed.artworks = [];
      }
    } else if (Array.isArray(processed.artworks)) {
      processed.artworks = processed.artworks.slice(0, 4);
    }
    
    logger.info(`Processed artist ${processed.name} with ${Array.isArray(processed.artworks) ? processed.artworks.length : 0} artworks`);
    
    return processed;
  };

  return {
    carouselApi,
    setCarouselApi,
    processArtist
  };
};
