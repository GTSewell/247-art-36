
import React from "react";
import { Artist } from "@/data/types/artist";
import ArtistCard from "./ArtistCard";

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
            techniques={typeof artist.techniques === 'string' 
              ? JSON.parse(artist.techniques) 
              : artist.techniques}
            styles={typeof artist.styles === 'string'
              ? JSON.parse(artist.styles)
              : artist.styles}
            social_platforms={typeof artist.social_platforms === 'string'
              ? JSON.parse(artist.social_platforms)
              : artist.social_platforms}
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
