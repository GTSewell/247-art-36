
import React from "react";
import { Artist } from "@/data/types/artist";
import PWAArtistCarousel from "@/components/pwa/PWAArtistCarousel";
import { logger } from "@/utils/logger";

interface FeaturedArtistsSectionProps {
  artists: Artist[];
  isLoading: boolean;
  favoriteArtists: Set<number>;
  handleArtistSelect: (artist: Artist) => void;
  handleFavoriteToggle: (artistId: number, isFavorite: boolean) => void;
}

const FeaturedArtistsSection: React.FC<FeaturedArtistsSectionProps> = ({
  artists,
  isLoading,
  favoriteArtists,
  handleArtistSelect,
  handleFavoriteToggle
}) => {
  // Refresh an artist's data
  const refreshArtist = async (artistId: number): Promise<void | Artist> => {
    try {
      logger.info(`Refreshing artist with ID: ${artistId}`);
      // This is just a placeholder to match the expected prop type
      // The full artist refreshing is handled in the parent component
      return undefined;
    } catch (err) {
      logger.error("Error in refreshArtist:", err);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-center mb-1">
        <img 
          src="/lovable-uploads/b9d20e81-12cd-4c2e-ade0-6590c3338fa7.png" 
          alt="Featured Artists" 
          className="h-14 object-contain"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <p className="text-lg">Loading artists...</p>
        </div>
      ) : artists && artists.length > 0 ? (
        <PWAArtistCarousel
          artists={artists}
          onSelect={handleArtistSelect}
          onFavoriteToggle={handleFavoriteToggle}
          favoriteArtists={favoriteArtists}
          refreshArtist={refreshArtist}
        />
      ) : (
        <div className="flex justify-center items-center h-24">
          <p className="text-lg">No artists found</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedArtistsSection;
