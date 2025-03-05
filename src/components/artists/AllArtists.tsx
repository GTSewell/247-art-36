
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import ArtistCard from "./ArtistCard";
import AllArtistsHeader from "./AllArtistsHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AllArtistsProps {
  artists: Artist[];
  allArtistsSearch: string;
  setAllArtistsSearch: (value: string) => void;
  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;
  onSelect: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  refreshArtist: (artistId: number) => Promise<void>;
}

const AllArtists = ({
  artists,
  allArtistsSearch,
  setAllArtistsSearch,
  showFavorites,
  setShowFavorites,
  onSelect,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  refreshArtist
}: AllArtistsProps) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);
  const isMobile = useIsMobile();

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    const index = artists.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setSelectedArtist(null);
    }, 300); // Delay clearing selectedArtist until after dialog animation
  };

  const handleArtistChange = (index: number) => {
    if (index >= 0 && index < artists.length) {
      setSelectedArtistIndex(index);
      setSelectedArtist(artists[index]);
    }
  };

  return (
    <div className="mt-8">
      <AllArtistsHeader
        allArtistsSearch={allArtistsSearch}
        setAllArtistsSearch={setAllArtistsSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        artistsCount={artists.length}
      />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              id={artist.id}
              name={artist.name}
              specialty={artist.specialty}
              image={artist.image}
              city={artist.city}
              country={artist.country}
              bio={artist.bio || ""}
              techniques={typeof artist.techniques === 'string' 
                ? JSON.parse(artist.techniques) 
                : artist.techniques}
              styles={typeof artist.styles === 'string'
                ? JSON.parse(artist.styles)
                : artist.styles}
              social_platforms={typeof artist.social_platforms === 'string'
                ? JSON.parse(artist.social_platforms)
                : artist.social_platforms}
              onSelect={(e) => handleArtistClick(e, artist)}
              onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
              isFavorite={favoriteArtists.has(artist.id)}
              refreshArtist={refreshArtist}
            />
          ))
        ) : (
          <div className="col-span-4 py-8 text-center text-gray-500">
            {showFavorites
              ? "You haven't favorited any artists yet."
              : "No artists match your search criteria."}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto">
          {selectedArtist && (
            <Carousel 
              className="w-full" 
              opts={{ 
                align: "start",
                containScroll: false,
                startIndex: selectedArtistIndex
              }}
              onSelect={(api) => {
                if (api) {
                  const currentIndex = api.selectedScrollSnap();
                  handleArtistChange(currentIndex);
                }
              }}
            >
              <CarouselContent className="-ml-0 sm:-ml-2">
                {artists.map((artist, index) => (
                  <CarouselItem key={artist.id} className="pl-0 sm:pl-2 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                      <ArtistImagePanel 
                        artist={artist}
                        onFavoriteToggle={onFavoriteToggle}
                        isFavorite={favoriteArtists.has(artist.id)}
                        refreshArtists={refreshArtists}
                      />
                      <ArtistDetailsPanel 
                        artist={artist}
                        onSelect={() => onSelect(artist)}
                        onFavoriteToggle={(artistId, isFavorite) => onFavoriteToggle(artistId, isFavorite)}
                        isFavorite={favoriteArtists.has(artist.id)}
                        onClose={(e) => {
                          e.stopPropagation();
                          handleDialogClose();
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-1 md:left-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
                <CarouselNext className="right-1 md:right-3 bg-white/70 backdrop-blur-sm hover:bg-white hover:text-black border-none" />
              </div>
              {isMobile && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 py-3 z-10">
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
    </div>
  );
};

export default AllArtists;
