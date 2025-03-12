
import React, { useState, useCallback } from "react";
import { Artist } from "@/data/types/artist";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ArtistModalContent from "./ArtistModalContent";
import { logger } from "@/utils/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext,
  type CarouselApi
} from "@/components/ui/carousel";

interface ArtistDetailModalProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  selectedArtistIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArtistChange: (index: number) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  onSelect: (artist: Artist) => void;
}

const ArtistDetailModal: React.FC<ArtistDetailModalProps> = ({
  artists,
  selectedArtist,
  selectedArtistIndex,
  open,
  onOpenChange,
  onArtistChange,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  onSelect
}) => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi | null>(null);
  
  // Add debug logging
  React.useEffect(() => {
    if (selectedArtist) {
      logger.info(`ArtistDetailModal - Selected artist: ${selectedArtist.name}, ID: ${selectedArtist.id}`);
    }
  }, [selectedArtist]);

  // Sync carousel with selected artist index
  React.useEffect(() => {
    if (api && open) {
      api.scrollTo(selectedArtistIndex);
    }
  }, [api, selectedArtistIndex, open]);

  // Handle carousel changes
  const handleCarouselChange = useCallback((index: number) => {
    if (index !== selectedArtistIndex) {
      onArtistChange(index);
    }
  }, [onArtistChange, selectedArtistIndex]);

  const handleSelect = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (api) {
      const selectedIndex = api.selectedScrollSnap();
      handleCarouselChange(selectedIndex);
    }
  }, [api, handleCarouselChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMobile ? 'w-[90vw] max-w-[95%] mx-auto' : 'max-w-5xl'} p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-[90vh] min-w-0`}
        style={{ width: isMobile ? '90vw' : undefined, boxSizing: 'border-box' }}
      >
        <DialogTitle className="sr-only">Artist Details</DialogTitle>
        <DialogDescription className="sr-only">Detailed information about the artist</DialogDescription>
        
        {isMobile ? (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              startIndex: selectedArtistIndex,
            }}
            className="w-full min-w-0"
            onSelect={handleSelect}
          >
            <CarouselContent className="-ml-1 min-w-0">
              {artists.map((artist, index) => (
                <CarouselItem key={artist.id} className="pl-1 w-full min-w-0">
                  <div className="w-full min-w-0">
                    <ArtistModalContent
                      artists={[artist]} // Pass as single artist array
                      selectedArtistIndex={0} // Always 0 since we're in a CarouselItem
                      onArtistChange={() => {}} // Handled by carousel now
                      onFavoriteToggle={onFavoriteToggle}
                      favoriteArtists={favoriteArtists}
                      refreshArtists={refreshArtists}
                      onSelect={onSelect}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Removed pagination indicator dots */}
          </Carousel>
        ) : (
          selectedArtist && (
            <ArtistModalContent
              artists={artists}
              selectedArtistIndex={selectedArtistIndex}
              onArtistChange={onArtistChange}
              onFavoriteToggle={onFavoriteToggle}
              favoriteArtists={favoriteArtists}
              refreshArtists={refreshArtists}
              onSelect={onSelect}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArtistDetailModal;
