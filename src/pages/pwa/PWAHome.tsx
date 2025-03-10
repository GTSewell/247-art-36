
import React, { useState, useEffect } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useArtists } from "@/hooks/use-artists";
import { TimerProvider } from "@/contexts/TimerContext";
import PWAFeaturedArtists from "@/components/pwa/PWAFeaturedArtists";
import PWATimedEditions from "@/components/pwa/PWATimedEditions";
import { logger } from "@/utils/logger";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";

const PWAHome = () => {
  const { featuredArtists, favoriteArtists, handleFavoriteToggle, refreshArtists } = useArtists();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPWA } = useAppMode();

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
        {isPWA ? <PWANavigation /> : <Navigation />}
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
      {/* Removed max-h-screen and overflow-hidden from the container */}
      <div className="min-h-screen bg-zap-yellow">
        {isPWA ? <PWANavigation /> : <Navigation />}

        {/* Updated main container with proper spacing and padding */}
        <main className={`w-full ${isPWA ? 'pt-16' : 'pt-24'} pb-20`}>
          {/* Added even more bottom padding to prevent footer overlap */}
          <div className="pb-64">
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
            <div className="mt-4 mb-12"> {/* Increased bottom margin */}
              <PWATimedEditions
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </TimerProvider>
  );
};

export default PWAHome;
