import React from 'react';
import ArtistCard from './ArtistCard';

interface FeaturedArtistsProps {
  artists: any[];
  onSelect: (artist: any) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  refreshArtist: (artistId: number) => void;
}

const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({
  artists,
  onSelect,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  refreshArtist
}) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onSelect={onSelect}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={favoriteArtists.has(artist.id)}
            refreshArtist={refreshArtist}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtists;
