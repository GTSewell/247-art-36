
import React from "react";
import { useNavigate } from "react-router-dom";
import { Artist } from "@/data/types/artist";
import AllArtistsHeader from "./AllArtistsHeader";
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
  const navigate = useNavigate();

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    // Navigate using the correct route format
    navigate(`/artist/${artist.name.toLowerCase().replace(/\s+/g, '')}`);
    // Still call onSelect for any parent components that might need this info
    onSelect(artist);
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

      <ArtistGrid 
        artists={artists}
        onArtistClick={handleArtistClick}
        onFavoriteToggle={onFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtist={refreshArtist}
        showFavorites={showFavorites}
      />
    </div>
  );
};

export default AllArtists;
