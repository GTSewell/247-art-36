
import React, { useState } from 'react';
import { Artist } from '@/data/types/artist';
import SearchHeader from './AllArtistsHeader';
import GridView from './AllArtistsGridView';
import CarouselView from './AllArtistsCarouselView';

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
      <SearchHeader
        allArtistsSearch={allArtistsSearch}
        setAllArtistsSearch={setAllArtistsSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {selectedArtistIndex !== null ? (
        <CarouselView
          artists={artists}
          selectedArtistIndex={selectedArtistIndex}
          onClose={closeCarousel}
          onFavoriteToggle={onFavoriteToggle}
          onSelect={onSelect}
          favoriteArtists={favoriteArtists}
        />
      ) : (
        <GridView
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
