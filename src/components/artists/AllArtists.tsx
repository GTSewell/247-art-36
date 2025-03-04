
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import ArtistCard from "./ArtistCard";
import AllArtistsHeader from "./AllArtistsHeader";
import ArtistDetails from "./ArtistDetails";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AllArtistsProps {
  artists: Artist[];
  allArtistsSearch: string;
  setAllArtistsSearch: (value: string) => void;
  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;
  onSelect: (artist: Artist) => void;
  onFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  favoriteArtists: Set<number>;
  refreshArtists: () => void;
  refreshArtist: (artistId: number) => Promise<void>;
}

const AllArtists = ({
  artists,
  allArtistsSearch,
  setAllArtistsSearch,
  showFavorites,
  setShowFavorites,
  onSelect,
  onFavoriteToggle,
  favoriteArtists,
  refreshArtists,
  refreshArtist
}: AllArtistsProps) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    setSelectedArtist(artist);
  };

  const handleDialogClose = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="mt-8">
      <AllArtistsHeader
        allArtistsSearch={allArtistsSearch}
        setAllArtistsSearch={setAllArtistsSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        artistsCount={artists.length} // Changed from artistCount to artistsCount
      />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              onSelect={(e) => handleArtistClick(e, artist)}
              onFavoriteToggle={(isFavorite) => onFavoriteToggle(artist.id, isFavorite)}
              isFavorite={favoriteArtists.has(artist.id)}
              refreshArtist={refreshArtist}
            />
          ))
        ) : (
          <div className="col-span-4 py-8 text-center text-gray-500">
            {showFavorites
              ? "You haven't favorited any artists yet."
              : "No artists match your search criteria."}
          </div>
        )}
      </div>

      <Dialog open={!!selectedArtist} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl h-[90vh] p-0">
          <ScrollArea className="h-full max-h-full">
            {selectedArtist && (
              <ArtistDetails
                artist={selectedArtist}
                onClose={handleDialogClose}
                onFavoriteToggle={(artistId, isFavorite) => // Fixed parameter types
                  onFavoriteToggle(artistId, isFavorite)
                }
                isFavorite={favoriteArtists.has(selectedArtist.id)}
                // Removed refreshArtist prop since it's not in ArtistDetailsProps
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllArtists;
