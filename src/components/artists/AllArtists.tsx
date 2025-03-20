
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import AllArtistsHeader from "./AllArtistsHeader";
import ArtistDetailModal from "./ArtistDetailModal";
import ArtistGrid from "./ArtistGrid";

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

const AllArtists: React.FC<AllArtistsProps> = ({
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
}) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);

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

  return (
    <div className="mt-8">
      <AllArtistsHeader
        artistsCount={artists.length}
      />

      <ArtistGrid 
        artists={artists}
        onArtistClick={handleArtistClick}
        onFavoriteToggle={onFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtist={refreshArtist}
        showFavorites={showFavorites}
      />

      <ArtistDetailModal
        artists={artists}
        selectedArtist={selectedArtist}
        selectedArtistIndex={selectedArtistIndex}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onArtistChange={handleArtistChange}
        onFavoriteToggle={onFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtists={refreshArtists}
        onSelect={onSelect}
      />
    </div>
  );
};

export default AllArtists;
