import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useArtists } from "@/hooks/use-artists";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";
import { logger } from "@/utils/logger";

const PWAHome = () => {
  const navigate = useNavigate();
  const { featuredArtists, favoriteArtists, handleFavoriteToggle, refreshArtists } = useArtists();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [timerState, setTimerState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        logger.info("Fetching featured products");

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          logger.error("Error fetching products:", error);
          setError("Failed to load products");
          throw error;
        }

        logger.info(`Fetched ${data?.length || 0} products`);
        setProducts(data || []);
      } catch (err) {
        logger.error("Error in fetchProducts:", err);
        setError("An error occurred while loading products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (product: any, timer: any) => {
    setSelectedProduct(product);
    setTimerState(timer);
  };

  const handleArtistSelect = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  // Refresh an artist's data with explicit generic type and explicit select fields.
  const refreshArtist = async (artistId: number): Promise<Artist | void> => {
    try {
      logger.info(`Refreshing artist with ID: ${artistId}`);
      const { data, error } = await supabase
        .from<Artist>("artists")
        .select("id, user_id") // ensure both id and user_id are selected
        .eq("id", artistId)
        .single();

      if (error) {
        logger.error("Error refreshing artist:", error);
        throw error;
      }

      logger.info("Artist refreshed successfully");
      return data;
    } catch (err) {
      logger.error("Error in refreshArtist:", err);
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
    <div className="min-h-screen bg-zap-yellow pb-20">
      <PWANavigation />

      <main className="container mx-auto px-4 pt-20">
        <div className="flex justify-center mb-8 mt-4">
          <img
            src="/lovable-uploads/0a46328d-bced-45e2-8877-d5c6914ff44c.png"
            alt="247.ART Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Featured Artists Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black text-center">
            FEATURED ARTISTS
          </h2>

          {featuredArtists && featuredArtists.length > 0 ? (
            <FeaturedArtists
              artists={featuredArtists}
              onSelect={handleArtistSelect}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteArtists={favoriteArtists}
              refreshArtists={refreshArtists}
              refreshArtist={refreshArtist}
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg">
                {isLoading ? "Loading artists..." : "No featured artists found"}
              </p>
            </div>
          )}
        </div>

        {/* Timed Edition Drops Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-black text-center flex items-center justify-center">
            <img
              src="/lovable-uploads/3ab59a55-2f79-43d8-970b-05c9af0af079.png"
              alt="Dynamite"
              className="w-8 h-8 mr-2"
            />
            TIMED EDITION DROPS
            <img
              src="/lovable-uploads/3ab59a55-2f79-43d8-970b-05c9af0af079.png"
              alt="Dynamite"
              className="w-8 h-8 ml-2 scale-x-[-1]"
            />
          </h2>

          {!isLoading && products.length > 0 ? (
            <FeaturedProducts
              products={products}
              onProductSelect={handleProductSelect}
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg">
                {isLoading ? "Loading products..." : "No products found"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PWAHome;
