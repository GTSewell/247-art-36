
import React from "react";
import { Artist } from "@/data/types/artist";
import ArtistCard from "./ArtistCard";
import { ensureArray } from "@/utils/ensureArray";

interface ArtistGridProps {
  artists: Artist[];
  onArtistClick: (e: React.MouseEvent, artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtist: (artistId: number) => Promise<void>;
  showFavorites: boolean;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({
  artists,
  onArtistClick,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtist,
  showFavorites
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artists.length > 0 ? (
        artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            id={artist.id}
            name={artist.name}
            specialty={artist.specialty}
            image={artist.image}
            city={artist.city}
            country={artist.country}
            bio={artist.bio || ""}
            techniques={ensureArray(artist.techniques)}
            styles={ensureArray(artist.styles)}
            social_platforms={ensureArray(artist.social_platforms)}
            onSelect={(e) => onArtistClick(e, artist)}
            onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
            isFavorite={favoriteArtists.has(artist.id)}
            refreshArtist={refreshArtist}
            showNameOverlay={true}
          />
        ))
      ) : (
        <div className="col-span-full py-8 text-center text-gray-500">
          {showFavorites
            ? "You haven't favorited any artists yet."
            : "No artists match your search criteria."}
        </div>
      )}
    </div>
  );
};

export default ArtistGrid;
