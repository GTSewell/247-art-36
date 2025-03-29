
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistCard from './ArtistCard';

interface ArtistGridViewProps {
  artists: Artist[];
  onArtistClick: (index: number, e: React.MouseEvent) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtist?: (artistId: number) => Promise<Artist | void>;
}

// Helper function to ensure we have an array
const ensureArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch (e) {
    return [value];
  }
};

const ArtistGridView: React.FC<ArtistGridViewProps> = ({
  artists,
  onArtistClick,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtist,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artists.map((artist, index) => (
        <div 
          key={artist.id} 
          onClick={(e) => onArtistClick(index, e)}
          className="cursor-pointer"
        >
          <ArtistCard
            {...artist}
            techniques={ensureArray(artist.techniques)}
            styles={ensureArray(artist.styles)}
            social_platforms={ensureArray(artist.social_platforms)}
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onArtistClick(index, e);
            }}
            onFavoriteToggle={(isFavorite) => {
              onFavoriteToggle(artist.id, isFavorite);
            }}
            isFavorite={favoriteArtists.has(artist.id)}
            refreshArtist={refreshArtist}
          />
        </div>
      ))}
    </div>
  );
};

export default ArtistGridView;
