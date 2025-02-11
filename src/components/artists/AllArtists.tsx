
import React, { useState } from 'react';
import { Artist } from '@/data/types/artist';
import AllArtistsHeader from './AllArtistsHeader';
import ArtistCarouselView from './ArtistCarouselView';
import ArtistGridView from './ArtistGridView';

interface AllArtistsProps {
  artists: Artist[];
  allArtistsSearch: string;
  setAllArtistsSearch: (search: string) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  onSelect: (artist: Artist) => void;
  onRegenerateImage: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
}

const AllArtists: React.FC<AllArtistsProps> = ({
  artists,
  allArtistsSearch,
  setAllArtistsSearch,
  showFavorites,
  setShowFavorites,
  onSelect,
  onRegenerateImage,
  onFavoriteToggle,
  favoriteArtists,
}) => {
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null);

  const handleArtistClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArtistIndex(index);
  };

  const closeCarousel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedArtistIndex(null);
  };

  return (
    <div className="mb-8">
      <AllArtistsHeader
        allArtistsSearch={allArtistsSearch}
        setAllArtistsSearch={setAllArtistsSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {selectedArtistIndex !== null ? (
        <ArtistCarouselView
          artists={artists}
          selectedIndex={selectedArtistIndex}
          onClose={closeCarousel}
          onSelect={onSelect}
          onFavoriteToggle={onFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />
      ) : (
        <ArtistGridView
          artists={artists}
          onArtistClick={handleArtistClick}
          onRegenerateImage={onRegenerateImage}
          onFavoriteToggle={onFavoriteToggle}
          favoriteArtists={favoriteArtists}
        />
      )}
    </div>
  );
};

export default AllArtists;
