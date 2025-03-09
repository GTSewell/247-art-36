
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import { toast } from "sonner";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import StoreCategories from "@/components/pwa/StoreCategories";
import CategoryProducts from "@/components/pwa/CategoryProducts";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import { ChevronLeft } from "lucide-react";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const PWAStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  
  const {
    data: products,
    isLoading,
    error
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('products').select('*, artists(name, image)').order('created_at', {
          ascending: false
        });
        if (error) {
          logger.error("Failed to load products from Supabase", error);
          toast.error("Failed to load products");
          return [];
        }
        return data || [];
      } catch (error) {
        logger.error("Error loading products:", error);
        toast.error("Failed to load products");
        return [];
      }
    }
  });

  if (error) {
    logger.error("Query error:", error);
  }

  const featuredProducts = products?.filter(p => p.is_featured) || [];
  const categoryProducts = selectedCategory 
    ? products?.filter(p => p.category === selectedCategory.toLowerCase()) || []
    : [];

  const handleProductSelect = (product: any, timerState: TimerState) => {
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    logger.info(`Selected category: ${category}`);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <TimerProvider>
      <div className="min-h-screen bg-zap-red pb-20">
        <PWANavigation />
        
        <main className="container mx-auto px-4 pt-20">
          {selectedCategory ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={handleBack}
                  className="flex items-center text-white bg-white/20 rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-nove text-white text-center uppercase tracking-wide">
                  {selectedCategory}
                </h1>
                <div className="w-10"></div> {/* Empty div for alignment */}
              </div>
              <CategoryProducts 
                products={categoryProducts} 
                categoryName={selectedCategory}
              />
            </div>
          ) : (
            <>
              {/* Timed Edition Drops Section */}
              <div className="mb-8">
                <div className="flex justify-center mb-1">
                  <img 
                    src="/lovable-uploads/24a9187e-656c-4725-8828-f68864f96228.png" 
                    alt="Timed Editions" 
                    className="h-14 object-contain"
                  />
                </div>

                {!isLoading && featuredProducts.length > 0 ? (
                  <FeaturedProducts
                    products={featuredProducts}
                    onProductSelect={handleProductSelect}
                  />
                ) : (
                  <div className="flex justify-center items-center h-24">
                    <p className="text-lg text-white">
                      {isLoading ? "Loading products..." : "No timed editions available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Categories Section */}
              <StoreCategories onCategorySelect={handleCategorySelect} />
            </>
          )}
        </main>
      </div>
    </TimerProvider>
  );
};

export default PWAStore;
