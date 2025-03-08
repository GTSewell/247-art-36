
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PWANavigation from "@/components/pwa/PWANavigation";
import { useArtists } from "@/hooks/use-artists";
import FeaturedArtists from "@/components/artists/FeaturedArtists";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/data/types/artist";

const PWAHome = () => {
  const navigate = useNavigate();
  const { featuredArtists, favoriteArtists, handleFavoriteToggle, refreshArtists } = useArtists();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [timerState, setTimerState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
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

  const refreshArtist = async (artistId: number): Promise<Artist | void> => {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();
        
      if (error) throw error;
      return data as Artist;
    } catch (error) {
      console.error('Error refreshing artist:', error);
    }
  };

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
          <h2 className="text-3xl font-bold mb-6 text-black text-center">FEATURED ARTISTS</h2>
          
          {featuredArtists.length > 0 ? (
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
              <p className="text-lg">Loading artists...</p>
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
              <p className="text-lg">Loading products...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PWAHome;
