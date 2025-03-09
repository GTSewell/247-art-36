
import React, { useState } from "react";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useArtists } from "@/hooks/use-artists";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import { Artist } from "@/data/types/artist";
import { TimerProvider } from "@/contexts/TimerContext";
import ArtistDetailModal from "@/components/artists/ArtistDetailModal";
import FeaturedArtistsSection from "@/components/pwa/home/FeaturedArtistsSection";
import TimedEditionsSection from "@/components/pwa/home/TimedEditionsSection";

const PWAHome = () => {
  const { artists, favoriteArtists, toggleFavorite: handleFavoriteToggle, refreshArtists, loading: artistsLoading } = useArtists();
  const { products, isLoading: productsLoading, error } = useFeaturedProducts();
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [timerState, setTimerState] = useState<any>(null);
  
  // Artist modal state
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtistIndex, setSelectedArtistIndex] = useState(0);

  const handleProductSelect = (product: any, timer: any) => {
    setSelectedProduct(product);
    setTimerState(timer);
  };

  const handleArtistSelect = (artist: Artist) => {
    const artistsToUse = artists || [];
    
    const index = artistsToUse.findIndex(a => a.id === artist.id);
    setSelectedArtistIndex(index >= 0 ? index : 0);
    setSelectedArtist(artist);
    setDialogOpen(true);
  };

  const handleArtistChange = (index: number) => {
    const artistsToUse = artists || [];
    
    if (index >= 0 && index < artistsToUse.length) {
      setSelectedArtistIndex(index);
      setSelectedArtist(artistsToUse[index]);
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
          <FeaturedArtistsSection 
            artists={artists || []}
            isLoading={artistsLoading}
            favoriteArtists={favoriteArtists}
            handleArtistSelect={handleArtistSelect}
            handleFavoriteToggle={handleFavoriteToggle}
          />

          {/* Timed Edition Drops Section */}
          <TimedEditionsSection 
            products={products}
            isLoading={productsLoading}
            onProductSelect={handleProductSelect}
          />
        </main>

        {/* Artist Detail Modal */}
        {selectedArtist && artists && (
          <ArtistDetailModal
            artists={artists}
            selectedArtist={selectedArtist}
            selectedArtistIndex={selectedArtistIndex}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onArtistChange={handleArtistChange}
            onFavoriteToggle={handleFavoriteToggle}
            favoriteArtists={favoriteArtists}
            refreshArtists={refreshArtists}
            onSelect={() => {}}
          />
        )}
      </div>
    </TimerProvider>
  );
};

export default PWAHome;
