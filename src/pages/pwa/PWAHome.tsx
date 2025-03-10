
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
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Handle manual refresh when user pulls down
  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      logger.info("Manual refresh initiated");
      await refreshArtists();
      logger.info("Manual refresh completed successfully");
    } catch (err) {
      logger.error("Error during manual refresh:", err);
      setError("Failed to refresh content");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add touch event listeners for pull-to-refresh
  useEffect(() => {
    if (!isPWA) return;

    let startY = 0;
    let mainElement: HTMLElement | null = null;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      mainElement = document.querySelector('main');
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!mainElement) return;
      
      const currentY = e.touches[0].clientY;
      const isAtTop = mainElement.scrollTop === 0;
      const pullDistance = currentY - startY;
      
      // If we're at the top and pulling down
      if (isAtTop && pullDistance > 70 && !isRefreshing) {
        e.preventDefault(); // Prevent default only when we want to refresh
        handleManualRefresh();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPWA, isRefreshing, refreshArtists]);

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
      <div className={`min-h-screen bg-zap-yellow ${isPWA ? 'h-screen' : ''}`}>
        {isPWA ? <PWANavigation /> : <Navigation />}

        <main className={`w-full ${isPWA ? 'pt-0 pb-16' : 'pt-24 pb-20'} ${isPWA ? 'h-[calc(100vh-64px)] overflow-y-auto' : ''}`}>
          {isRefreshing && (
            <div className="absolute top-0 left-0 right-0 flex justify-center items-center py-2 bg-zap-yellow z-10">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-zap-red border-t-transparent rounded-full"></div>
              <span className="text-sm">Refreshing...</span>
            </div>
          )}
          <div className={`${isPWA ? 'pb-20' : 'pb-64'}`}>
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

            {/* Timed Edition Drops Section - no margin to eliminate space */}
            <div className={`${isPWA ? 'mb-16' : 'mb-12'} mt-0`}>
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
