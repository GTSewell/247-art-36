
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import ArtistCard from "./ArtistCard";
import AllArtistsHeader from "./AllArtistsHeader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ArtistDetailsPanel from "./ArtistDetailsPanel";
import ArtistImagePanel from "./ArtistImagePanel";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.preventDefault();
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedArtist(null);
  };

  return (
    <div className="mt-8">
      <AllArtistsHeader
        allArtistsSearch={allArtistsSearch}
        setAllArtistsSearch={setAllArtistsSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        artistsCount={artists.length}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
          {selectedArtist && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ArtistImagePanel 
                artist={selectedArtist}
                onFavoriteToggle={onFavoriteToggle}
                isFavorite={favoriteArtists.has(selectedArtist.id)}
                refreshArtists={refreshArtists}
              />
              <ArtistDetailsPanel 
                artist={selectedArtist}
                onSelect={() => onSelect(selectedArtist)}
                onFavoriteToggle={(artistId, isFavorite) => onFavoriteToggle(artistId, isFavorite)}
                isFavorite={favoriteArtists.has(selectedArtist.id)}
                onClose={(e) => {
                  e.stopPropagation();
                  handleDialogClose();
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllArtists;
