
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useArtists } from "@/hooks/use-artists";
import { TimerProvider } from "@/contexts/TimerContext";
import PWAFeaturedArtists from "@/components/pwa/PWAFeaturedArtists";
import PWATimedEditions from "@/components/pwa/PWATimedEditions";
import { logger } from "@/utils/logger";

const PWAHome = () => {
  const { featuredArtists, favoriteArtists, handleFavoriteToggle, refreshArtists } = useArtists();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading to false after artists have been loaded
    if (featuredArtists.length > 0) {
      setIsLoading(false);
    }
  }, [featuredArtists]);

  // Refresh an artist's data
  const refreshArtist = async (artistId: number) => {
    try {
      logger.info(`Refreshing artist with ID: ${artistId}`);
      const result = await refreshArtists(artistId);
      logger.info("Artist refreshed successfully");
      return result;
    } catch (err) {
      logger.error("Error in refreshArtist:", err);
      return undefined;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zap-yellow">
        <PWANavigation />
        <div className="container mx-auto px-4 pt-20 pb-20 flex flex-col items-center justify-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zap-red text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <TimerProvider>
      <div className="min-h-screen bg-zap-yellow pb-20">
        <PWANavigation />

        <main className="container mx-auto px-4 pt-16">
          {/* Featured Artists Section */}
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-lg">Loading artists...</p>
            </div>
          ) : (
            <PWAFeaturedArtists
              featuredArtists={featuredArtists}
              favoriteArtists={favoriteArtists}
              handleFavoriteToggle={handleFavoriteToggle}
              refreshArtists={refreshArtists}
              refreshArtist={refreshArtist}
            />
          )}

          {/* Timed Edition Drops Section */}
          <PWATimedEditions
            isLoading={isLoading}
          />
        </main>
      </div>
    </TimerProvider>
  );
};

export default PWAHome;
