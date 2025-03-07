
import React from "react";
import { Artist } from "@/data/types/artist";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CarouselApi } from "@/components/ui/carousel";
import { generateColorTheme } from "@/utils/colorExtraction";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-[90vh]">
        <DialogTitle className="sr-only">Artist Details</DialogTitle>
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
                // Get artworks array from the artist
                const artworks = Array.isArray(artist.artworks) 
                  ? artist.artworks 
                  : typeof artist.artworks === 'string' && artist.artworks
                    ? JSON.parse(artist.artworks)
                    : [];
                    
                // Generate a color theme for this specific artist
                const colorTheme = generateColorTheme(
                  artist, 
                  { 
                    id: '',
                    artist_id: String(artist.id),
                    background_image: artworks[0] || null,
                    background_color: '#f7cf1e',
                    panel_color: '#ffffff',
                    links: []
                  }, 
                  artworks
                );
                
                return (
                  <CarouselItem key={artist.id} className="pl-0 sm:pl-2 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ backgroundColor: colorTheme.panel }}>
                      <div className="aspect-square md:aspect-auto md:h-auto">
                        <ArtistImagePanel 
                          artist={artist}
                          onFavoriteToggle={onFavoriteToggle}
                          isFavorite={favoriteArtists.has(artist.id)}
                          refreshArtists={refreshArtists}
                        />
                      </div>
                      <div className="aspect-auto md:h-auto">
                        <ArtistDetailsPanel 
                          artist={artist}
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
