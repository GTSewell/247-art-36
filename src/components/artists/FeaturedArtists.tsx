
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    // Navigate directly to artist profile page
    const artistSlug = artist.name.toLowerCase().replace(/\s+/g, '');
    navigate(`/artist/${artistSlug}`);
    // Still call onSelect for any parent components that might need this info
    onSelect(artist);
  };

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
            onSelect={(e) => handleArtistClick(e, artist)}
            onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
            isFavorite={favoriteArtists.has(artist.id)}
            refreshArtist={refreshArtist}
            showNameOverlay={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtists;
