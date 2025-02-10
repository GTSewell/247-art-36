
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistCard from './ArtistCard';

interface FeaturedArtistsProps {
  artists: Artist[];
  onSelect: (id: number | null) => void;
  onRegenerateImage: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
}

const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({
  artists,
  onSelect,
  onRegenerateImage,
  onFavoriteToggle,
  favoriteArtists,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          {...artist}
          onSelect={onSelect}
          onRegenerateImage={() => onRegenerateImage(artist)}
          isFeatured={true}
          onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
          isFavorite={favoriteArtists.has(artist.id)}
        />
      ))}
    </div>
  );
};

export default FeaturedArtists;
