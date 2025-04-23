
import React, { useState, useCallback, useEffect } from "react";
import { Artist } from "@/data/types/artist";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ArtistModalContent from "./ArtistModalContent";
import { logger } from "@/utils/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi
} from "@/components/ui/carousel";
import ArtistBadges from "./ArtistBadges";

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
  const [currentArtistIndex, setCurrentArtistIndex] = useState(selectedArtistIndex);
  const currentArtist = artists[currentArtistIndex] || selectedArtist;
  
  // Check if the current artist should show Signature Artist or Demo badge
  const isSignatureArtist = currentArtist?.id ? currentArtist.id >= 26 : false;
  const isDemo = currentArtist?.id ? currentArtist.id !== 24 && currentArtist.id !== 26 : false;
  
  React.useEffect(() => {
    if (selectedArtist) {
      logger.info(`ArtistDetailModal - Selected artist: ${selectedArtist.name}, ID: ${selectedArtist.id}`);
    }
  }, [selectedArtist]);

  React.useEffect(() => {
    if (api && open) {
      api.scrollTo(selectedArtistIndex);
      setCurrentArtistIndex(selectedArtistIndex);
    }
  }, [api, selectedArtistIndex, open]);

  // Update the current artist index when the carousel changes
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      setCurrentArtistIndex(currentIndex);
      onArtistChange(currentIndex);
    };

    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onArtistChange]);

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

  useEffect(() => {
    if (!isMobile || !open || !api) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        api.scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        api.scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api, isMobile, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Mobile badges positioned above the modal - now uses currentArtistIndex */}
      {isMobile && open && currentArtist && (
        <div className="fixed z-[99] top-[12%] left-0 right-0 flex justify-center pointer-events-none">
          <ArtistBadges 
            isSignatureArtist={isSignatureArtist}
            isDemo={isDemo}
            position="top-left"
            isMobile={true}
            overrideStyle={true}
          />
        </div>
      )}
      
      <DialogContent 
        className={`${isMobile ? 'w-[90vw] max-w-[95%] mx-auto mt-8' : 'max-w-5xl w-[80vw]'} p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-[85vh] min-w-0`}
        style={{ boxSizing: 'border-box', background: 'white' }}
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
            className="w-full min-w-0 overflow-visible"
            onSelect={handleSelect}
          >
            <CarouselContent className="-ml-1 min-w-0 overflow-visible">
              {artists.map((artist, index) => (
                <CarouselItem key={artist.id} className="pl-1 w-full min-w-0 overflow-visible">
                  <div className="w-full min-w-0 overflow-visible">
                    <ArtistModalContent
                      artists={[artist]} // Pass as single artist array
                      selectedArtistIndex={0} // Always 0 since we're in a CarouselItem
                      selectedArtist={artist} // Pass the current artist explicitly
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
          </Carousel>
        ) : (
          selectedArtist && (
            <ArtistModalContent
              artists={artists}
              selectedArtistIndex={selectedArtistIndex}
              selectedArtist={selectedArtist} // Pass the selected artist explicitly
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
