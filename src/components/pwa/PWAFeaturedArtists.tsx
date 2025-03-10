
import React, { useState } from "react";
import { Artist } from "@/data/types/artist";
import PWAArtistCarousel from "@/components/pwa/PWAArtistCarousel";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";

interface PWAFeaturedArtistsProps {
  featuredArtists: Artist[];
  favoriteArtists: Set<number>;
  handleFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
  refreshArtists: () => void;
  refreshArtist: (artistId: number) => Promise<void | Artist>;
}

const PWAFeaturedArtists: React.FC<PWAFeaturedArtistsProps> = ({
  featuredArtists,
  favoriteArtists,
  handleFavoriteToggle,
  refreshArtists,
  refreshArtist,
}) => {
  // Artist modal state
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);

  const handleArtistSelect = (artist: Artist) => {
    const index = featuredArtists.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index >= 0 ? index : 0);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    setSelectedArtistIndex(index);
    setSelectedArtist(featuredArtists[index]);
  };

  return (
    <>
      <div className="mb-0 w-full">
        <div className="flex justify-center mb-1">
          <img 
            src="/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png" 
            alt="Featured Artists" 
            className="h-14 object-contain"
          />
        </div>

        <div className="w-full overflow-hidden">
          <PWAArtistCarousel
            artists={featuredArtists}
            onSelect={handleArtistSelect}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteArtists={favoriteArtists}
            refreshArtist={refreshArtist}
          />
        </div>
      </div>

      {/* Artist Detail Modal */}
      <ArtistDetailModal
        artists={featuredArtists}
        selectedArtist={selectedArtist}
        selectedArtistIndex={selectedArtistIndex}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onArtistChange={handleArtistChange}
        onFavoriteToggle={handleFavoriteToggle}
        favoriteArtists={favoriteArtists}
        refreshArtists={refreshArtists}
        onSelect={(artist) => {}}
      />
    </>
  );
};

export default PWAFeaturedArtists;
