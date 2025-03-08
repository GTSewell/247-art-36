import React from "react";
import { Artist } from "@/data/types/artist";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";
import ArtistCarouselNavigation from "./ArtistCarouselNavigation";
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
  const selectedArtist = artists[selectedArtistIndex];
  const isLastArtist = selectedArtistIndex === artists.length - 1;
  const isFirstArtist = selectedArtistIndex === 0;
  const isFavorite = favoriteArtists.has(selectedArtist.id);

  // Create a handler that adapts onSelect to the expected event signature
  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(selectedArtist);
  };
  return <div className={`flex flex-col lg:flex-row w-full ${isMobile ? 'max-h-[85vh] overflow-y-scroll' : 'max-h-[80vh]'}`}>
      <div className="lg:w-1/2 p-4 lg:p-8 overflow-y-auto py-0 px-0">
        <ArtistImagePanel artist={selectedArtist} onFavoriteToggle={onFavoriteToggle} isFavorite={isFavorite} refreshArtists={refreshArtists} />
      </div>
      
      <div className="lg:w-1/2 p-4 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto px-0 py-0">
        <ArtistDetailsPanel artist={selectedArtist} onFavoriteToggle={onFavoriteToggle} isFavorite={isFavorite} onSelect={handleSelect} />
      </div>
      
      <ArtistCarouselNavigation isFirstArtist={isFirstArtist} isLastArtist={isLastArtist} isMobile={isMobile} onPrevious={() => onArtistChange(selectedArtistIndex - 1)} onNext={() => onArtistChange(selectedArtistIndex + 1)} />
    </div>;
};
export default ArtistModalContent;