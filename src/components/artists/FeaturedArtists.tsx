import React, { useState } from 'react';
import ArtistCard from './ArtistCard';
import { Artist } from '@/data/types/artist';
import ArtistDetailModal from './ArtistDetailModal';

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
    // No need to check bounds since we're implementing looping in ArtistModalContent
    setSelectedArtistIndex(index);
    setSelectedArtist(artists[index]);
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
          />
        ))}
      </div>

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

export default FeaturedArtists;
