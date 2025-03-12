import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PWANavigation from "@/components/pwa/PWANavigation";
import Navigation from "@/components/navigation/Navigation";
import { useAppMode } from "@/contexts/AppModeContext";
import { toast } from "sonner";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import StoreCategories from "@/components/pwa/StoreCategories";
import CategoryProducts from "@/components/pwa/CategoryProducts";
import { TimerProvider } from "@/contexts/TimerContext";
import { logger } from "@/utils/logger";
import { ChevronLeft } from "lucide-react";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import AnimatedCollectionBanner from "@/components/pwa/AnimatedCollectionBanner";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const PWAStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  const { isPWA } = useAppMode();
  
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

  const getProductsForCategory = (categoryId: string) => {
    const categoryProducts = products?.filter(p => p.category === categoryId) || [];
    
    if (categoryProducts.length === 0 && !isLoading) {
      const sampleProducts = [];
      const categoryNames = {
        'original': 'Original Artwork',
        'signed': 'Signed Print',
        'sticker': 'Sticker',
        'merch': 'T-Shirt',
        'print': 'Art Print',
        'collection': '247 Collection'
      };
      
      for (let i = 1; i <= 6; i++) {
        sampleProducts.push({
          id: `sample-${categoryId}-${i}`,
          name: `${categoryNames[categoryId as keyof typeof categoryNames]} ${i}`,
          price: (Math.random() * 100 + 20).toFixed(2),
          category: categoryId,
          image_url: i % 3 === 0 ? '/placeholder.svg' : 
                    categoryId === 'print' ? 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1000&auto=format&fit=crop' : 
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
          is_limited_edition: i % 2 === 0,
          artists: { name: 'Demo Artist' }
        });
      }
      
      return sampleProducts;
    }
    
    return categoryProducts;
  };

  const featuredProducts = products?.filter(p => p.is_featured) || [];
  const categoryProducts = selectedCategory ? getProductsForCategory(selectedCategory) : [];

  const handleProductSelect = (product: any, timerState: TimerState) => {
    logger.info(`Selected product: ${product.id}, timer: ${JSON.stringify(timerState)}`);
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

  const getCategoryDisplayName = (categoryId: string) => {
    switch(categoryId) {
      case 'original': return 'ORIGINAL ARTWORK';
      case 'signed': return 'SIGNED & NUMBERED';
      case 'sticker': return 'STICKERS & FUN STUFF';
      case 'merch': return 'T-SHIRTS & APPAREL';
      case 'print': return 'ART PRINTS & POSTERS';
      case 'collection': return 'THE 247 COLLECTION';
      default: return categoryId.toUpperCase();
    }
  };

  return (
    <TimerProvider>
      <div className="min-h-screen bg-zap-red">
        {isPWA ? <PWANavigation /> : <Navigation />}
        
        <main className={`container mx-auto px-4 ${isPWA ? 'pt-8' : 'pt-24'} pb-24`}>
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
                  {getCategoryDisplayName(selectedCategory)}
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
              <div className="mb-0 mt-0">
                <div className="flex justify-center mb-2">
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

              <AnimatedCollectionBanner />

              <StoreCategories onCategorySelect={handleCategorySelect} />
            </>
          )}
        </main>

        <TimedEditionModal
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedTimerState(null);
          }}
          product={selectedProduct}
          timeLeft={selectedTimerState || { hours: 0, minutes: 0, seconds: 0 }}
        />
      </div>
    </TimerProvider>
  );
};

export default PWAStore;
