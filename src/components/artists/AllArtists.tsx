
import React from 'react';
import { Artist } from '@/data/types/artist';
import ArtistCard from './ArtistCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-foreground">All Artists</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-border">
            <Checkbox
              id="showFavorites"
              checked={showFavorites}
              onCheckedChange={(checked) => setShowFavorites(checked as boolean)}
              className="data-[state=checked]:bg-zap-yellow data-[state=checked]:text-black"
            />
            <label
              htmlFor="showFavorites"
              className="text-sm font-medium leading-none cursor-pointer select-none"
            >
              View Favorite Artists
            </label>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search artists..."
              value={allArtistsSearch}
              onChange={(e) => setAllArtistsSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            {...artist}
            onSelect={() => onSelect(artist)}
            onRegenerateImage={() => onRegenerateImage(artist)}
            onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
            isFavorite={favoriteArtists.has(artist.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllArtists;
