
import React from "react";
import { Artist } from "@/data/types/artist";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CarouselApi } from "@/components/ui/carousel";
import { generateColorTheme } from "@/utils/colorExtraction";
import { logger } from "@/utils/logger";

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
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null);

  // Add debug logging
  React.useEffect(() => {
    if (selectedArtist) {
      logger.info(`ArtistDetailModal - Selected artist: ${selectedArtist.name}, ID: ${selectedArtist.id}`);
      
      // Process and log artworks info
      const artworks = Array.isArray(selectedArtist.artworks) 
        ? selectedArtist.artworks 
        : typeof selectedArtist.artworks === 'string' && selectedArtist.artworks
          ? JSON.parse(selectedArtist.artworks)
          : [];
          
      const artworkCount = Array.isArray(artworks) ? artworks.length : 0;
      logger.info(`ArtistDetailModal - Artworks count before processing: ${artworkCount}`);
      
      // Log the first 6 artwork URLs for debugging
      if (Array.isArray(artworks) && artworks.length > 0) {
        const limitedArtworks = artworks.slice(0, 4); // Enforce 4 max
        logger.info(`ArtistDetailModal - Limited to 4 artworks, actual count: ${limitedArtworks.length}`);
      }
    }
  }, [selectedArtist]);

  // Handle dialog close
  const handleDialogClose = () => {
    onOpenChange(false);
  };

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

  // Process selected artist's artworks to ensure maximum of 4
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
    
    return processed;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-[90vh]">
        <DialogTitle className="sr-only">Artist Details</DialogTitle>
        <DialogDescription className="sr-only">Detailed information about the artist</DialogDescription>
        {selectedArtist && (
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
                
                // Get artworks array from the processed artist
                const artworks = Array.isArray(processedArtist.artworks) 
                  ? processedArtist.artworks 
                  : typeof processedArtist.artworks === 'string' && processedArtist.artworks
                    ? JSON.parse(processedArtist.artworks).slice(0, 4)
                    : [];
                    
                // Generate a color theme for this specific artist
                const colorTheme = generateColorTheme(
                  processedArtist, 
                  { 
                    id: '',
                    artist_id: String(processedArtist.id),
                    background_image: artworks[0] || null,
                    background_color: '#f7cf1e',
                    panel_color: '#ffffff',
                    links: []
                  }, 
                  artworks
                );
                
                return (
                  <CarouselItem key={artist.id} className="pl-0 sm:pl-2 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4" style={{ backgroundColor: colorTheme.panel }}>
                      <div className="aspect-square md:aspect-auto md:h-auto">
                        <ArtistImagePanel 
                          artist={processedArtist}
                          onFavoriteToggle={onFavoriteToggle}
                          isFavorite={favoriteArtists.has(artist.id)}
                          refreshArtists={refreshArtists}
                        />
                      </div>
                      <div className="aspect-auto md:h-auto">
                        <ArtistDetailsPanel 
                          artist={processedArtist}
                          onSelect={() => onSelect(artist)}
                          onFavoriteToggle={(artistId, isFavorite) => onFavoriteToggle(artistId, isFavorite)}
                          isFavorite={favoriteArtists.has(artist.id)}
                          onClose={(e) => {
                            e.stopPropagation();
                            handleDialogClose();
                          }}
                          colorTheme={colorTheme}
                          showReturnButton={false}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-1 md:left-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
              <CarouselNext className="right-1 md:right-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
            </div>
            {isMobile && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 py-2 z-10">
                <div className="flex gap-1 items-center bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <ChevronLeft size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-600">Swipe</span>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>
            )}
          </Carousel>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArtistDetailModal;
