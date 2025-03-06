
import React from 'react';
import ArtistCard from './ArtistCard';
import { Artist } from '@/data/types/artist';

interface FeaturedArtistsProps {
  artists: Artist[];
  onSelect: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  refreshArtist: (artistId: number) => Promise<void | Artist>;
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
            id={artist.id}
            name={artist.name}
            specialty={artist.specialty}
            image={artist.image}
            city={artist.city}
            country={artist.country}
            bio={artist.bio}
            techniques={artist.techniques}
            styles={artist.styles}
            social_platforms={artist.social_platforms}
            onSelect={() => onSelect(artist)}
            onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
            isFavorite={favoriteArtists.has(artist.id)}
            refreshArtist={refreshArtist}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtists;
